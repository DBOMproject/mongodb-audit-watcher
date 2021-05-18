/* eslint-disable no-unused-expressions */
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

const chai = require('chai');
const watcher = require('../controller/watcher');

const { expect } = chai;
const {
  before,
  after,
  describe,
  it,
} = require('mocha');

describe('X509 Authentication', () => {
  before(() => {
    process.env.MONGO_TLS_MODE_ENABLED = '1';
  });
  after(() => {
    delete process.env.MONGO_TLS_MODE_ENABLED;
  });

  it('is supported', () => {
    const client = watcher.makeClientFromEnv();
    expect(client.s.options)
      .to
      .have
      .property('tlsCAFile');
    expect(client.s.options)
      .to
      .have
      .property('tlsCertificateKeyFile');
    expect(client.s.options)
      .to
      .have
      .property('tls');
    expect(client.s.options.tls)
      .to
      .be
      .true;
  });
});
