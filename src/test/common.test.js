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

const BSON = require('bson');

exports.exampleMongoDBChangeEvent = {
  _id: { _data: '825FA2DB25000000012B022C0100296E5A1004F9A5E8D0CE5948738185057BDF8B323246645F696400645F97CE740B7A739191013F3A0004' },
  operationType: 'replace',
  clusterTime: new BSON.Timestamp(1, 1604508593),
  fullDocument: {
    _id: '5f97ce740b7a739191013f3a',
    key: 'value',
  },
  ns: {
    db: 'primary',
    coll: 'C1',
  },
  documentKey: { _id: '5f97ce740b7a739191013f3a' },
};
