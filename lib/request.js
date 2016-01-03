'use strict';

const _ = require('lodash');
const request = require('superagent');

const logRequest = require('debug')('request');


class AccountRequest {

  constructor(accountKey) {
   this._accountKey = accountKey;
  }


  *createData(type, data) {
    logRequest(`Posting ${type} data to the new account...`);

    let result = yield request
      .post(`https://api.logentries.com/v2/${type}`)
      .send(_.extend({
        request: 'create',
        account: this._accountKey,
        acl: this._accountKey
      }, data))
      .set('Content-Type', 'application/json');

    return result.body;
  }


  *getData(type) {
    let result = yield request
      .post(`https://api.logentries.com/v2/${type}`)
      .send({
        request: 'list',
        account: this._accountKey,
        acl: this._accountKey
      })
      .set('Content-Type', 'application/json');

    return result.body[type];
  }


  *getLogSet(logSet) {
    let result = yield request
      .get(`https://api.logentries.com/${this._accountKey}/hosts/${encodeURI(logSet)}`);

    return result.body;
  }


  *getLog(logSet, log) {
    let result = yield request
      .get(`https://api.logentries.com/${this._accountKey}/hosts/${encodeURI(logSet)}/${encodeURI(log)}`);

    return result.body;
  }

}

module.exports = AccountRequest;
