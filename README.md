# DBoM MongoDB Audit Watcher

Uses the mongodb change stream in order to generate audit channel that tracks changes to assets. Intended to be used in tandem with the Database Agent. Note that you will need MongoDB running with a working oplog to run this microservice.
Only the host of the mongodb repository is expected to run this microservice to enable the auditing functionality of the database agent 

If you have configured a standalone installation of mongodb, follow [these instructions](https://docs.mongodb.com/manual/tutorial/convert-standalone-to-replica-set/) to convert it into a replicaset. 

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [How to Use](#how-to-use)
  - [API](#api)
  - [Configuration](#configuration)
- [Helm Deployment](#helm-deployment)
- [Jenkins Pipeline](#jenkins-pipeline)
- [Getting Help](#getting-help)
- [Getting Involved](#getting-involved)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How to Use

### Configuration

| Environment Variable         | Default          | Description                                                                     |
|------------------------------|------------------|---------------------------------------------------------------------------------|
| LOG_LEVEL                    | `info`           | The verbosity of the logging                                                    |
| PORT                         | `3000`           | Port on which the gateway listens                                               |
| MONGO_URI                    | -                | A mongodb uri string. If this is specified, all other mongo args are overridden |
| MONGO_HOST                   | `mongodb`        | The host on which mongodb is available                                          |
| MONGO_PORT                   | `27017`          | Port on which mongodb's native driver api is available                          |
| MONGO_PASS                   | `pass`           | Password for mongo host                                                         |
| MONGO_REPLICA_SET_NAME       | ``               | Name of the mongo replicaset. Only required if connecting to an rs mongo        |
| CHANNEL_DB                   | `primary`        | The database used as the channel collection                                     |
| AUDIT_POSTFIX                | `_audit`         | The postfix added to the audit channel for any given channel                    |
| PERSIST_PATH                 | `./persist`      | Path where the service can store the resume token over restarts                 |

## Helm Deployment

Instructions for deploying the mongodb audit watcher using helm charts can be found [here](https://github.com/DBOMproject/deployment/blob/master/charts/mongodb-audit-watcher)

## Getting Help

If you have any queries on insert-project-name, feel free to reach us on any of our [communication channels](https://github.com/DBOMproject/community/blob/master/COMMUNICATION.md) 

If you have questions, concerns, bug reports, etc, please file an issue in this repository's [issue tracker](https://github.com/DBOMproject/node-sdk/issues).

## Getting Involved

This section should detail why people should get involved and describe key areas you are
currently focusing on; e.g., trying to get feedback on features, fixing certain bugs, building
important pieces, etc.

General instructions on _how_ to contribute should be stated with a link to [CONTRIBUTING](CONTRIBUTING.md).