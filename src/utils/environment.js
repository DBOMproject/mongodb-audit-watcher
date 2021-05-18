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
 * Handles retrieval of environment variables
 * @module environment
 */
const {env} = process

/**
 * @typedef {Object} MongoDBTLSParams
 * @property {boolean} enabled - Whether TLS is enforced
 * @property {string} mongoOptions.tlsCAFile - Path to CA's PEM file for mTLS with mongod
 * @property {string} mongoOptions.tlsCertificateKeyFile - Path to client's PEM file for mongodb authorization
 * @property {string|null} mongoOptions.tlsCertificateKeyFilePassword - Password for client's PEM file (if encrypted)
 */

/**
 * Gets the TLS Parameters to connect to MongoDB (if set in the environment)
 * @func
 * @return {MongoDBTLSParams} - TLS environment parameters
 */
const getTLSParams = () => {
  let certPass = null
  if (env.MONGO_TLS_CLIENT_CERT_PASS_KEY !== '') {
    const key = env.MONGO_TLS_CLIENT_CERT_PASS_KEY
    certPass = env[key] !== '' ? env[key] : null
  } else if (env.MONGO_TLS_CLIENT_CERT_PASS !== '') {
    certPass = env.MONGO_TLS_CLIENT_CERT_PASS
  }

  return {
    enabled: env.MONGO_TLS_MODE_ENABLED === '1' || false,
    mongoOptions: {
      tlsCAFile: env.MONGO_TLS_CA_CERT_PATH || '',
      tlsCertificateKeyFile: env.MONGO_TLS_CLIENT_CERT_PATH || '',
      tlsAllowInvalidHostnames: env.MONGO_TLS_ALLOW_INVALID_HOST === '1' || false,
      tlsCertificateKeyFilePassword: certPass,
    },
  }
}

/**
 * Gets the uri to connect to mongo db from environmental variables
 * @func
 * @return string - MongoDB URI
 */
const getMongoURIFromEnv = () => {
  if (env.MONGO_URI) return env.MONGO_URI
  const host = env.MONGO_HOST || 'localhost'
  const port = env.MONGO_PORT || '27017'
  const user = env.MONGO_USER || 'root'
  const secretPass = env.MONGO_PASS_KEY || 'mongodb-root-password'
  const pass = env[secretPass] || env.MONGO_PASS || 'pass'
  let replicaSetParameter = ''

  if (env.MONGO_REPLICA_SET_NAME && env.MONGO_REPLICA_SET_NAME !== '') {
    replicaSetParameter = `?replicaSet=${env.MONGO_REPLICA_SET_NAME}`
  }

  if (getTLSParams().enabled) {
    return `mongodb://${host}:${port}/${replicaSetParameter}`
  }
  return `mongodb://${user}:${pass}@${host}:${port}/${replicaSetParameter}`
}

/**
 * Gets the collection postfix to append to the audit collections from environment variables
 * @func
 */
const getAuditCollectionPostfix = () => (env.AUDIT_POSTFIX ? env.AUDIT_POSTFIX : '_audit')

/**
 * Gets the database on which the collections are present from environment variables
 * @func
 */
const getChannelDB = () => (env.CHANNEL_DB ? env.CHANNEL_DB : 'primary')

/**
 * Gets the preferred log level from environment variables
 * @func
 */
const getLogLevel = () => (env.LOG_LEVEL ? env.LOG_LEVEL : 'info')

/**
 * Path to the directory in which persistent data can be stored.
 * @func
 */
const getPersistPath = () => (env.PERSIST_PATH ? env.PERSIST_PATH : './persist')


/**
 * Get the integer value in milliseconds of the server selection timeout
 * @return {number}
 */
const getMongoServerSelectionTimeout = () => parseInt(env.MONGO_SERVER_SELECTION_TIMEOUT, 10) || 3000

/**
 * Get the integer value in milliseconds of the connection timeout
 * @return {number}
 */
const getMongoConnectionTimeout = () => parseInt(env.MONGO_CONNECTION_TIMEOUT, 10) || 3000


module.exports = {
  getTLSParams,
  getChannelDB,
  getMongoURIFromEnv,
  getAuditCollectionPostfix,
  getLogLevel,
  getPersistPath,
  getMongoServerSelectionTimeout,
  getMongoConnectionTimeout,
}
