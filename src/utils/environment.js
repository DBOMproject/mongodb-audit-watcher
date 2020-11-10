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

/** Handles retrieval of environment variables
 * @module environment
 */
const { env } = process;

/**
 * Gets the uri to connect to mongo db from environment variables
 * @func
 */
exports.getMongoURI = () => {
  if (env.MONGO_URI) return env.MONGO_URI;

  const host = env.MONGO_HOST || 'mongodb';
  const port = env.MONGO_PORT || '27017';
  const user = env.MONGO_USER || 'root';
  const secretPass = env.MONGO_PASS_KEY || 'mongodb-root-password';
  const pass = env[secretPass] || env.MONGO_PASS || 'pass';
  let replicaSetParameter = '';

  if (env.MONGO_REPLICA_SET_NAME && env.MONGO_REPLICA_SET_NAME !== '') {
    replicaSetParameter = `?replicaSet=${env.MONGO_REPLICA_SET_NAME}`;
  }

  return `mongodb://${user}:${pass}@${host}:${port}/${replicaSetParameter}`;
};

/**
 * Gets the collection postfix to append to the audit collections from environment variables
 * @func
 */
exports.getAuditCollectionPostfix = () => (env.AUDIT_COLLECTION_POSTFIX ? env.AUDIT_COLLECTION_POSTFIX : '_audit');

/**
 * Gets the database on which the collections are present from environment variables
 * @func
 */
exports.getChannelDB = () => (env.CHANNEL_DB ? env.CHANNEL_DB : 'primary');

/**
 * Gets the preferred log level from environment variables
 * @func
 */
exports.getLogLevel = () => (env.LOG_LEVEL ? env.LOG_LEVEL : 'info');

/**
 * Path to the directory in which persistent data can be stored.
 * @func
 */
exports.getPersistPath = () => (env.PERSIST_PATH ? env.PERSIST_PATH : './persist');
