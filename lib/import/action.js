'use strict';

const Actions = require('../actions');
const ImportIterator = require('./import-iterator');
const _ = require('lodash');

const log = require('debug')('log');


class ActionImporter {

  constructor(request) {
    this._request = request;
  }


  *importAll(accountData, tags, options) {
    let actions = yield ImportIterator.map(accountData.actions.getAll(), function*(action, index, length) {
      log(`Importing ${index + 1} of ${length} Action...`);
      return yield this._createAction(action, tags, options);
    }, this);

    return Actions.create(actions);
  }


  *_createAction(action, tags, options) {
    let requestData = {
      enabled: action.enabled,
      type: action.type,
      rate_count: _.get(options, 'alertRateCount', action.rate_count),
      rate_range: _.get(options, 'alertRateRange', action.rate_range),
      limit_count: _.get(options, 'alertLimitCount', action.limit_count),
      limit_range: _.get(options, 'alertLimitRange', action.limit_range),
      args: action.args,
      schedule: action.schedule,
      aux: action.aux
    };

    if (options.alertEmails) {
      requestData.args = this._changeEmailArgs(action.args, options.alertEmails);
    }

    if (this._isTag(action.type)) {
      requestData.args.sn = this._getNewTags(tags, parseInt(action.args.sn));
    }

    let newAction = yield this._request.createData('actions', requestData);
    newAction.old_id = action.id;
    return newAction;
  }


  _getNewTags(tags, actionSn) {
    if (tags.hasByOldSn(actionSn)) return tags.getByOldSn(actionSn).sn;
    return actionSn;
  }


  _changeEmailArgs(args, alertEmails) {
    if (args && args.direct) args.direct = alertEmails;
    return args;
  }


  _isTag(type) {
    return type === 'tagit';
  }


  static create(request, accountData) {
    return new ActionImporter(request, accountData);
  }

}

module.exports = ActionImporter;
