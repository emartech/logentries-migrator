'use strict';

const AccountData = require('../account-data');

const log = require('debug')('log');
const logError = require('debug')('error');

class Export {

  constructor(request) {
    this._request = request;
  }

  *fetchAll() {
    return AccountData.create({
      hooks: (yield this._getData('hooks')).map(this._resetAccountId),
      tags: (yield this._getData('tags')).map(this._resetAccountId),
      actions: (yield this._getData('actions')).map(this._resetAccountId)
    });
  }


  *_getData(type) {
    log(`Getting ${type} data from the old account...`);

    try {
      return yield this._request.getData(type);
    } catch(err) {
      if (!err.response || !err.response.statusCode) logError(err.stack);
      else logError(`Error on getting ${type}:\n > Status: ${err.response.statusCode}\n > Content: ${err.response.text}`);
    }
  }


  _resetAccountId(item) {
    item.account_id = '';
    return item;
  }


  static create(request) {
    return new Export(request);
  }

}

module.exports = Export;
