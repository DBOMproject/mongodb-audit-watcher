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

/** Handles setup of logs
 * @module logging
 * @requires winston
 */

const { transports, configure, format } = require('winston');
const log = require('winston');
const { getLogLevel } = require('./environment');

/**
 * Sets up the logs
 * @func
 */
exports.setupLogs = () => {
  if (process.env.NODE_ENV === 'test') {
    configure({ silent: true });
    return;
  }
  const console = new transports.Console();
  configure({
    level: getLogLevel(),
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.align(),
      format.printf(
        (info) => `${info.timestamp} ${info.level} ${info.message}`,
      ),
    ),
    transports: [
      console,
    ],
  });
};

exports.logFatalError = (error) => {
  log.error(`${error}. Fatal`);
  process.exit(1);
};
