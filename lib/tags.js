'use strict';


class Tags {

  constructor(tags) {
    this._tags = tags || [];
  }


  add(tag) {
    this._tags.push(tag);
  }


  has(tagToSearch) {
    return Boolean(this.getByName(tagToSearch.name));
  }


  getByName(name) {
    return this._tags.find((tag) => tag.name === name);
  }


  getAll() {
    return this._tags;
  }


  hasByOldSn(sn) {
    return Boolean(this.getByOldSn(sn));
  }


  getByOldSn(sn) {
    return this._tags.find((tag) => tag.old_sn === sn);
  }


  static create(tags) {
    if (tags instanceof Tags) return new Tags(tags.getAll());
    return new Tags(tags);
  }

}


module.exports = Tags;
