/*
 *  Copyright 2020 Unisys Corporation
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

/**
 * Handles watching and acting on mongo change events
 * @module watcher
 */

const log = require('winston');
const mongodb = require('mongodb');
const persistence = require('../utils/persistence');
const env = require('../utils/environment');
const audit = require('./audit');

/**
 * Creates an instance of the mongoDB client based on environment variables
 * @func
 * @return {MongoClient} - Client that is ready to connect to
 */
const makeClientFromEnv = () => {
  let mongoClient;
  const tlsParams = env.getTLSParams();
  const defaultOptions = {
    numberOfRetries: 5,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: env.getMongoConnectionTimeout(),
    serverSelectionTimeoutMS: env.getMongoServerSelectionTimeout(),
  };
  if (tlsParams.enabled) {
    log.info('Using mutual TLS authentication and X509 authorization');
    mongoClient = new mongodb.MongoClient(env.getMongoURIFromEnv(),
      {
        ...tlsParams.mongoOptions,
        ...defaultOptions,
        tls: true,
      });
  } else {
    mongoClient = new mongodb.MongoClient(env.getMongoURIFromEnv(),
      {
        ...defaultOptions,
      });
  }
  return mongoClient;
};

/**
 * Takes a mongoDB change event and commits it to the audit channel
 * @param db
 * @param {Object} mongoDBChangeEvent - A mongoDB change event
 * @param auditChannelPostfix
 * @param {{_data: string}} mongoDBChangeEvent._id - A change resume token
 * @param {string} mongoDBChangeEvent.operationType - Type of mongoDB operation
 * @param {Object} mongoDBChangeEvent.fullDocument - The document that was changed, in full
 * @param {{db:string, coll:string}} mongoDBChangeEvent.ns - The namespace under which the change has occurred
 * @param {Timestamp} mongoDBChangeEvent.clusterTime - The time, as recorded on the mongo oplog
 * @returns {boolean} - A boolean that signifies if the event was committed
 */
const commitChannelEventToDB = async (db, auditChannelPostfix, mongoDBChangeEvent) => {
  const resumeToken = mongoDBChangeEvent._id._data;

  let operationType;
  if (mongoDBChangeEvent.ns.coll.endsWith(auditChannelPostfix)) {
    log.debug('Event is from an audit channel, ignoring', { token: resumeToken });
    await persistence.updateResumeToken(mongoDBChangeEvent._id);
    return false;
  }
  if (!(mongoDBChangeEvent.operationType in audit.operationMap)) {
    log.debug('Not a change or update event, ignoring', { token: resumeToken });
    await persistence.updateResumeToken(mongoDBChangeEvent._id);
    return false;
  }
  operationType = audit.operationMap[mongoDBChangeEvent.operationType];

  const auditEntry = audit.createEntry(mongoDBChangeEvent, operationType);

  try {
    await audit.commitEntry(db, `${mongoDBChangeEvent.ns.coll}${auditChannelPostfix}`, auditEntry);
    await persistence.updateResumeToken(mongoDBChangeEvent._id);
    return true;
  } catch (e) {
    log.error(`An error occurred while attempting to commit the audit payload: ${e}`, { token: resumeToken });
    return false;
  }
};

/**
 * Binds a mongodb database instance to a function that handles a channel event and commits it as an
 * audit entry
 * @param db
 * @param auditChannelPostfix
 * @return {function(*=):boolean}
 */
const makeChannelEventCommitter = (db, auditChannelPostfix) => {
  // We're already testing commitChannelEventToDB. Suppressing coverage for the following function
  /* istanbul ignore next */
  // eslint-disable-next-line max-len
  return (mongoDBChangeEvent) => commitChannelEventToDB(db, auditChannelPostfix, mongoDBChangeEvent);
};

/**
 * Watches for change events on a database and fires a change handler asynchronously
 * @param {Db} db - MongoDB Database Instance
 * @param {function(Object)} changeHandler - a function that is called when a change is triggered
 * @param {function(Object)} errorHandler - a function that is called when a change is triggered
 * @param {{_id: {data: string}}=} resumeToken - A mongoDB change stream resume token. Is optional
 */
const initWatcher = (db, resumeToken, changeHandler, errorHandler) => {
  let changeEventEmitter;
  try {
    changeEventEmitter = db.watch([], {
      fullDocument: 'updateLookup',
      resumeAfter: resumeToken,
    });
  } catch (e) {
    log.warn(`Could not resume, got error (${e}). Attempting without resume token`);
    persistence.purgeResumeToken();
    changeEventEmitter = db.watch([], {
      fullDocument: 'updateLookup',
    });
  }
  changeEventEmitter.on('change', changeHandler);
  changeEventEmitter.on('error', errorHandler);
  log.info('Listening to changes');
};

module.exports = {
  initWatcher,
  makeChannelEventCommitter,
  commitChannelEventToDB,
  makeClientFromEnv
};
