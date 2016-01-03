'use strict';


class Actions {

  constructor(actions) {
    this._actions = actions || [];
  }


  add(action) {
    this._actions.push(action);
  }


  has(actionToSearch) {
    return Boolean(this.getById(actionToSearch.id));
  }


  hasByOldId(id) {
    return Boolean(this.getByOldId(id));
  }


  getById(id) {
    return this._actions.find((action) => action.id === id);
  }


  getByOldId(id) {
    return this._actions.find((action) => action.old_id === id);
  }


  getAll() {
    return this._actions;
  }


  static create(actions) {
    if (actions instanceof Actions) return new Actions(actions.getAll());
    return new Actions(actions);
  }

}


module.exports = Actions;
