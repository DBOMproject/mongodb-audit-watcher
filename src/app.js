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

const log = require('winston')
const persistence = require('./utils/persistence')
const logging = require('./utils/logging')
const env = require('./utils/environment')
const watcher = require('./controller/watcher')
const {logFatalError} = require('./utils/logging')

logging.setupLogs()

const client = watcher.makeClientFromEnv()

/**
 * Initiate the watcher after we connect to mongoDB
 * @param {MongoClient} connectedClient
 */
const watchAfterConnect = async (connectedClient) => {
  log.info('MongoDB Connected!')
  const db = connectedClient.db(env.getChannelDB())

  // Get a resume token if there is one
  const resumeToken = await persistence.getResumeToken()

  if (resumeToken == null) {
    log.info('No resume token. Will start watching collections/channels from now')
  } else {
    log.info('A resume token was found. Attempting to resume from where I left off')
  }

  watcher.initWatcher(db,
    resumeToken,
    watcher.makeChannelEventCommitter(db, env.getAuditCollectionPostfix()),
    logFatalError)
}

log.info('Trying to connect to mongoDB using environment configuration')
log.debug(`MongoDB: URI is  ${env.getMongoURIFromEnv()}`)
client.connect().then(watchAfterConnect, logFatalError)

module.exports = {
  watchAfterConnect,
}
