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

const {
  after, describe, it,
} = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiJsonSchema = require('chai-json-schema-ajv');
const dirtyChai = require('dirty-chai');
const chaiAsPromised = require('chai-as-promised');
const addFormats = require('ajv-formats');
const { exampleMongoDBChangeEvent } = require('./common.test');
const auditEntrySchema = require('./auditEntry.schema');

const auditModule = require('../controller/audit');

// Chai extensions
chai.use(sinonChai);
chai.use(chaiJsonSchema);
chai.use(chaiAsPromised);
chai.use(dirtyChai);

addFormats(chai.ajv);

chai.should();

describe('audit', () => {
  after(sinon.restore);

  describe('createEntry', () => {
    it('Should return an audit entry with a valid schema', () => {
      auditModule.createEntry(exampleMongoDBChangeEvent, 'OP_TYPE')
        .should
        .be
        .jsonSchema(auditEntrySchema);
    });
  });

  describe('commitEntry', () => {
    it('Creates an entry on the database', () => {
      const insertOneSpy = sinon.spy();
      const db = {
        collection: sinon.stub()
          .returns(
            {
              insertOne: insertOneSpy,
            },
          ),
      };
      auditModule.commitEntry(db, 'Channel', {});
      insertOneSpy.should.have.been.called();
    });
  });
});
