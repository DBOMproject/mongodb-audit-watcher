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
  before, describe, it, beforeEach, afterEach,
} = require('mocha');
const appModule = require("../app.js")
const decache = require('decache');
const sinon = require('sinon');
const chai = require('chai')
const winston = require('winston');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');
const mongoDB = require('mongodb');
const { exampleMongoDBChangeEvent } = require('./common.test');
const persistence = require('../utils/persistence');
const watcher = require('../controller/watcher');
const logging = require('../utils/logging');
const chaiAsPromised = require('chai-as-promised');
// Chai extensions
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(dirtyChai);

chai.should();

let fakeMongoClient = {
  connect: sinon.stub().resolves()
}


before((done) => {
  decache('../app');
  sinon.stub(mongoDB, 'MongoClient').returns(fakeMongoClient);
  // eslint-disable-next-line global-require
  app = require('../app');
  done();
});


describe('watchAfterConnect', () =>{
  let dbStub
  let connectedClientStub
  let getResumeTokenStub
  let initWatcherStub
  beforeEach(() => {
    dbStub = sinon.stub().returns({})
    connectedClientStub = {
      db: dbStub
    }
    getResumeTokenStub = sinon.stub(persistence, 'getResumeToken').resolves(exampleMongoDBChangeEvent._id)
    initWatcherStub = sinon.stub(watcher, 'initWatcher')
  })

  afterEach(sinon.restore);

  it('Handles the case where a resume token exists', () => {
    appModule.watchAfterConnect(connectedClientStub).should.eventually.be.ok
  })

  it('Handles the case where a resume token does not exist', () => {
    getResumeTokenStub.resolves(null)
    appModule.watchAfterConnect(connectedClientStub).should.eventually.be.ok
  })
})

