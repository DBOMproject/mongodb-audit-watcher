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

/** Handles persistence of the resume token
 * @module persistence
 * @requires level
 */

const level = require('level');
const { getPersistPath } = require('./environment');

let persistenceDB;

const RESUME_TOKEN_KEY = 'resumeToken';

/**
 * Set up LevelDB if it's not already ready
 * @func
 */
const checkAndInitLevelDB = () => {
  if (persistenceDB === undefined) {
    persistenceDB = level(`${getPersistPath()}/levelDB`, { valueEncoding: 'json' });
  }
};

/**
 * Gets resume token from LevelDB store
 * @func
 */
exports.getResumeToken = async () => {
  checkAndInitLevelDB();
  try {
    return await persistenceDB.get(RESUME_TOKEN_KEY);
  } catch (e) {
    return undefined;
  }
};

/**
 * Updates resume token from LevelDB store
 * @func
 */
exports.updateResumeToken = async (token) => {
  checkAndInitLevelDB();
  await persistenceDB.put(RESUME_TOKEN_KEY, token);
};

/**
 * Purges resume token from LevelDB store
 * @func
 */
exports.purgeResumeToken = async () => {
  checkAndInitLevelDB();
  await persistenceDB.del(RESUME_TOKEN_KEY);
};
