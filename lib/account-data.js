'use strict';

const Tags = require('./tags');
const Actions = require('./actions');

class AccountData {

  constructor() {
    this.hooks = [];
    this.actions = Actions.create();
    this.tags = Tags.create();
  }


  toJSON() {
    return {
      hooks: this.hooks,
      actions: this.actions.getAll(),
      tags: this.tags.getAll()
    };
  }


  static create(data) {
    let accountData = new AccountData();
    accountData.hooks = data.hooks;
    accountData.actions = new Actions(data.actions);
    accountData.tags = new Tags(data.tags);
    return accountData;
  }

}


module.exports = AccountData;
