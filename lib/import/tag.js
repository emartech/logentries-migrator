'use strict';

const log = require('debug')('log');
const logSkip = require('debug')('skip');
const Tags = require('../tags');


class TagImporter {

  constructor(request) {
    this._request = request;
  }


  *importAll(accountData) {
    let existingTags = yield this._getExistingTags();

    for (let tag of accountData.tags.getAll()) {
      if (tag.name === '_HOOK_IDENTIFIER_') continue;

      if (existingTags.has(tag)) {
        existingTags.getByName(tag.name).old_sn = tag.sn;
        logSkip(`"${tag.name}" Tag is already exists`);
        continue;
      }

      log(`Importing "${tag.name}" Tag...`);

      let newTag = yield this._createTag(tag);
      newTag.old_sn = tag.sn;
      existingTags.add(newTag);
    }

    return existingTags;
  }



  *_getExistingTags() {
    return new Tags(yield this._request.getData('tags'));
  }


  *_createTag(tag) {
    return yield this._request.createData('tags', {
      name: tag.name,
      title: tag.title,
      description: tag.description,
      appearance: tag.appearance
    });
  }


  static create(request) {
    return new TagImporter(request);
  }

}

module.exports = TagImporter;
