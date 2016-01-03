'use strict';

const _ = require('lodash');

const TagImporter = require('./tag');
const ActionImporter = require('./action');
const HookImporter = require('./hook');

class Import {

  constructor(request) {
    this._request = request;
  }

  *importAll(accountData, options) {
    let targetLogs = yield this._getTargetLogs(options);

    let newTags = yield TagImporter.create(this._request).importAll(accountData);
    let newActions = yield ActionImporter.create(this._request).importAll(accountData, newTags, options);
    yield HookImporter.create(this._request).importAll(accountData, targetLogs, newActions);
  }


  *_getTargetLogs(options) {
    let logRequestBody;

    if (!options.logSet) return [];

    if (options.log) {
      logRequestBody = yield this._request.getLog(options.logSet, options.log);
      return [logRequestBody.key];
    }

    logRequestBody = yield this._request.getLogSet(options.logSet);
    return logRequestBody.logs.map((log) => log.key);
  }


  static create(options) {
    return new Import(options);
  }
}

module.exports = Import;
