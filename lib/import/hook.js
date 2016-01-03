'use strict';

const log = require('debug')('log');
const logSkip = require('debug')('skip');
const logError = require('debug')('error');

class HookImporter {

  constructor(request) {
    this._request = request;
  }


  *importAll(accountData, targetLogs, actions) {
    for (let hook of accountData.hooks) {
      try {
        yield this._createHook(hook, targetLogs, actions);
      } catch(err) {
        if (!err.response || !err.response.statusCode) logError(err.stack);
        else logError(`Error on importing "${hook.name}" Alert: error=${JSON.stringify(err.response.error.message)} response=${err.response.text}`);
      }
    }
  }


  *_createHook(hook, targetLogs, actions) {
    if (/^DemoTag/.test(hook.name)) {
      logSkip(`"${hook.name}" Alert is skipped because it is considered as a Heroku demo alert`);
      return;
    }

    log(`Importing "${hook.name}" Alert...`);

    let requestData = {
      name: hook.name,
      enabled: hook.enabled,
      priority: hook.priority,
      triggers: hook.triggers,
      actions: this._getActionsFor(hook, actions),
      sources: targetLogs,
      groups: [],
      aux: hook.aux
    };

    yield this._request.createData('hooks', requestData);
  }


  _getActionsFor(hook, actions) {
    let hookActions = [];

    for (let actionId of hook.actions) {
      if (actions.hasByOldId(actionId)) hookActions.push(actions.getByOldId(actionId).id);
    }

    return hookActions;
  }


  static create(request) {
    return new HookImporter(request);
  }

}

module.exports = HookImporter;
