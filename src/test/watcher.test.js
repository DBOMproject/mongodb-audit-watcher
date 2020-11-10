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
 describe, it, beforeEach, afterEach,
} = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const chaiJsonSchema = require('chai-json-schema-ajv');
const chaiAsPromised = require('chai-as-promised');
const cloneDeep = require('lodash.clonedeep');

const { exampleMongoDBChangeEvent } = require('./common.test');
const watcherModule = require('../controller/watcher');
const audit = require('../controller/audit');
const persistence = require('../utils/persistence');

chai.should();

// Chai extensions
chai.use(sinonChai);
chai.use(chaiJsonSchema);
chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe('watcher', () => {
  afterEach(sinon.restore);

  describe('initWatcher', () => {
    it('connects to the database and registers event listeners for change and error', () => {
      const changeHandlerSpy = sinon.spy();
      const mockDB = {
        watch: sinon.stub()
          .returns(
            {
              on: changeHandlerSpy,
            },
          ),
      };

      watcherModule.initWatcher(mockDB, undefined, sinon.fake(), sinon.fake());
      changeHandlerSpy.should.have.been.calledTwice();
    });
  });
  describe('commitChannelEventToDB', () => {
    let commitEntryStub; let updateResumeTokenStub; let
      createEntryStub;
    beforeEach(() => {
      commitEntryStub = sinon.stub(audit, 'commitEntry').resolves();
      updateResumeTokenStub = sinon.stub(persistence, 'updateResumeToken').returns();
      createEntryStub = sinon.stub(audit, 'createEntry').returns({});
    });

    it('Takes a valid event and commits it successfully', () => watcherModule.commitChannelEventToDB({}, '_audit', exampleMongoDBChangeEvent)
      .should.eventually.equal(true).then(() => {
        createEntryStub.should.be.called();
        commitEntryStub.should.be.called();
        updateResumeTokenStub.should.be.called();
      }));

    it('Rejects any event with audit postfix in channel', () => {
      const modifiedChangeEvent = cloneDeep(exampleMongoDBChangeEvent);
      modifiedChangeEvent.ns.coll = 'C1_audit';

      return watcherModule.commitChannelEventToDB({}, '_audit', modifiedChangeEvent)
        .should.eventually.equal(false).then(() => {
          createEntryStub.should.not.be.called();
          commitEntryStub.should.not.be.called();
          updateResumeTokenStub.should.be.called();
        });
    });
    it('Rejects any unrecognized event', () => {
      const modifiedChangeEvent = cloneDeep(exampleMongoDBChangeEvent);
      modifiedChangeEvent.operationType = 'delete';
      return watcherModule.commitChannelEventToDB({}, '_audit', modifiedChangeEvent)
        .should.eventually.equal(false).then(() => {
          createEntryStub.should.not.be.called();
          commitEntryStub.should.not.be.called();
          updateResumeTokenStub.should.be.called();
        });
    });
    it('Handles commit failures', () => {
      commitEntryStub.rejects();
      return watcherModule.commitChannelEventToDB({}, '_audit', exampleMongoDBChangeEvent)
        .should.eventually.equal(false).then(() => {
          createEntryStub.should.be.called();
          commitEntryStub.should.be.called();
          updateResumeTokenStub.should.not.be.called();
        });
    });
  });
  describe('makeChannelEventCommiter', () => {
    it('Should return a curried function', () => {
      watcherModule.makeChannelEventCommitter().should.be.a('function');
    });
  });
});
