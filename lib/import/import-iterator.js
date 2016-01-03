'use strict';

const logError = require('debug')('error');


class ImportIterator {

  static *map(models, cb, scope) {
    let importedModels = [];
    let processedModelCount = 0;

    for (let model of models) {
      try {
        let importedModel = yield cb.call(scope, model, processedModelCount, models.length);
        importedModels.push(importedModel);
      } catch(err) {
        console.log(err);

        if (!err.response || !err.response.statusCode) logError(err.stack);
        else logError(`Import request error: ${JSON.stringify(err.response.error.message)} Request response: ${err.response.text}`);
      }

      processedModelCount++;
    }

    return importedModels;
  }

}

module.exports = ImportIterator;
