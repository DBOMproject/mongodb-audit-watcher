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
 * Handles the generation and commit for DBoM Audit Entries
 * @module audit
 */

const log = require('winston');

/**
 * Represents the mapping from mongodb change event names to DBoM audit entry names
 * @const
 * @default
 */
const operationMap = {
  replace: 'UPDATE',
  insert: 'CREATE',
};

/**
 * Takes a mongodb change event and generates a DBoM audit entry
 * @param {Object} mongoChangeEvent - A mongoDB change event
 * @param {string} dbomOperationType - Type of DBoM operation
 * @param {{_data: string}} mongoChangeEvent._id - A change resume token
 * @param {Object} mongoChangeEvent.fullDocument - The document that was changed, in full
 * @param {Timestamp} mongoChangeEvent.clusterTime - The time, as recorded on the mongo oplog
 * @return {{timestamp, payload, resourceID, eventType, channelID}} - A DBoM audit entry
 */
const createEntry = (mongoChangeEvent, dbomOperationType) => {
  let payload;
  let resourceID;
  // eslint-disable-next-line prefer-const
  ({ _id: resourceID, ...payload } = mongoChangeEvent.fullDocument);
  return {
    timestamp: new Date(mongoChangeEvent.clusterTime.getHighBits() * 1000).toISOString(),
    payload,
    resourceID,
    eventType: dbomOperationType,
  };
};

/**
 * Commits an audit entry to the audit channel on the database
 * @param {Db} db
 * @param {{timestamp, payload, resourceID, eventType}} auditEntry
 * @param auditChannel
 */
const commitEntry = async (db, auditChannel, auditEntry) => {
  log.info(`Committing audit entry for change of ${auditEntry.resourceID} to ${auditChannel}`);
  await db.collection(auditChannel)
    .insertOne(auditEntry);
};

module.exports = {
  commitEntry,
  createEntry,
  operationMap,
};
