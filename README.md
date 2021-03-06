# DBoM MongoDB Audit Watcher

Uses the mongodb change stream in order to generate audit channel that tracks changes to assets. Intended to be used in tandem with the Database Agent. Note that you will need MongoDB running with a working oplog to run this microservice.
Only the host of the mongodb repository is expected to run this microservice to enable the auditing functionality of the database agent 

If you have configured a standalone installation of mongodb, follow [these instructions](https://docs.mongodb.com/manual/tutorial/convert-standalone-to-replica-set/) to convert it into a replicaset. 

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [How to Use](#how-to-use)
  - [Configuration](#configuration)
- [Helm Deployment](#helm-deployment)
- [Platform Support](#platform-support)
- [Getting Help](#getting-help)
- [Getting Involved](#getting-involved)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How to Use

### Configuration

| Environment Variable           | Default                      | Description                                                                                                    |
|--------------------------------|------------------------------|----------------------------------------------------------------------------------------------------------------|
| LOG_LEVEL                      | `info`                       | The verbosity of the logging                                                                                   |
| MONGO_URI                      | -                            | A mongodb uri string. If this is specified, all other mongo args are overridden                                |
| MONGO_HOST                     | `mongodb`                    | The host on which mongodb is available                                                                         |
| MONGO_PORT                     | `27017`                      | Port on which mongodb's native driver api is available                                                         |
| MONGO_PASS                     | `pass`                       | Password for mongo host                                                                                        |
| MONGO_REPLICA_SET_NAME         | ``                           | Name of the mongo replicaset. Only required if connecting to an rs mongo                                       |
| MONGO_TLS_MODE_ENABLED         | `0`                          | If set to 1, enable TLS mongodb connections and present a client certificate for authorization                 |
| MONGO_TLS_CLIENT_CERT_PATH     | ``                           | Path to client certificate as .PEM encoded file. Relative to launch directory. Required if TLS mode is enabled |
| MONGO_TLS_CA_CERT_PATH         | ``                           | Path to CAs certificate as a .PEM encoded file. Relative to launch directory. Required if TLS mode is enabled  |
| MONGO_TLS_CLIENT_CERT_PASS_KEY | `MONGO_TLS_CLIENT_CERT_PASS` | Environment variable key for client certificate password.                                                      |
| MONGO_TLS_CLIENT_CERT_PASS     | ``                           | Key to decrypt client certificate. Required if client certificate is protected with a passphrase               |
| MONGO_TLS_ALLOW_INVALID_HOST   | `0`                          | Allow use of server TLS certificates which do not have matching hostnames                                      |
| MONGO_SERVER_SELECTION_TIMEOUT | `3000`                       | Timeout for mongodb server selection. In milliseconds                                                          |
| MONGO_CONNECTION_TIMEOUT       | `3000`                       | Timeout for mongodb connection establishment. In milliseconds                                                  |
| CHANNEL_DB                     | `primary`                    | The database used as the channel collection                                                                    |
| AUDIT_POSTFIX                  | `_audit`                     | The postfix added to the audit channel for any given channel                                                   |
| PERSIST_PATH                   | `./persist`                  | Path where the service can store the resume token over restarts                                                |

## Helm Deployment

Instructions for deploying the mongodb audit watcher using helm charts can be found [[here](https://github.com/DBOMproject/deployments/tree/master/charts/mongodb-audit-watcher)


## Platform Support

Currently, we provide pre-built container images for linux amd64 and arm64 architectures via our Github Actions Pipeline. Find the images [here](https://hub.docker.com/r/dbomproject/mongodb-audit-watcher)

## Getting Help

If you have any queries on mongodb-audit-watcher, feel free to reach us on any of our [communication channels](https://github.com/DBOMproject/community/blob/master/COMMUNICATION.md) 

If you have questions, concerns, bug reports, etc, please file an issue in this repository's [issue tracker](https://github.com/DBOMproject/mongodb-audit-watcher/issues).

## Getting Involved

Find the instructions on how you can contribute in [CONTRIBUTING](CONTRIBUTING.md).
