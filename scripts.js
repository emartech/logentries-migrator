'use strict';

const AccountData = require('./lib/account-data');
const Request = require('./lib/request');
const Export = require('./lib/export');
const Import = require('./lib/import');
const fs = require('fs');

const log = require('debug')('log');


module.exports = {

  *export(options) {
    const oldAccountRequest = new Request(options.accountKey);
    let accountData = yield Export.create(oldAccountRequest).fetchAll();

    if (options.output) {
      fs.writeFileSync(options.output, JSON.stringify(accountData.toJSON()));
      log(`Data dumped to the ${options.output} file...`);
    }

    return accountData;
  },


  *import(options) {
    let accountData;

    if (options.input) {
      let inputData = JSON.parse(fs.readFileSync(options.input, 'utf8'));
      accountData = AccountData.create(inputData);
      log(`Loaded data from the input file ${options.input}...`);
    } else {
      accountData = yield this.export(options);
      log(`Loaded data from the old account...`);
    }

    const newAccountRequest = new Request(options.targetAccountKey);
    yield Import.create(newAccountRequest).importAll(accountData, options);
  }


};
