'use strict';

process.env.DEBUG = `log,error,skip,${process.env.DEBUG || ''}`;

const co = require('co');
const _ = require('lodash');
const scripts = require('./scripts');

const logError = require('debug')('error');

var argv = require('yargs')
    .version(function() {
      return require('./package').version;
    })
    .usage('Usage: $0 <command> [options]')
    .command('export', 'Get tags and alerts from a Logentries account', (yargs) => {
      argv = yargs
        .usage(`Usage: $0 export --account_key 123-asd-345 --output 'output.json'`)
        .option('account_key', {
          demand: true,
          description: 'Account key to get the data from'
        })
        .option('output', {
          demand: true,
          description: 'Filename to export the data'
        })
        .help('help')
        .argv
    })
    .command('import', 'Import tags and alerts into a Logentries account', (yargs) => {
      argv = yargs
        .usage(`Usage: $0 import --account_key 123-asd-345 --target_account_key 234-bda-543 --log_set 'Sample logset' --log 'Sample logs' --alert_emails 'sample@sample.com' --alert_rate_count 11 --alert_rate_range 'hour' --alert_limit_count 22 --alert_limit_range 'hour' --output 'backup.json'`)
        .option('account_key', {
          description: 'Account key to get the data from. This or the input argument should be provided!'
        })
        .option('output', {
          description: 'Filename to dump the exported data to later use'
        })
        .option('input', {
          description: 'Filename for import the data from. This or the account_key argument should be provided!'
        })
        .option('target_account_key', {
          description: 'The account key to import the data'
        })
        .option('log_set', {
          description: 'Add the alerts to the logs of the specified log set'
        })
        .option('log', {
          description: 'Add the alerts to a log. The log_set argument should be provided to use this option!'
        })
        .option('alert_emails', {
          description: `Set the direct mail alerts to the specified email instead of the exported one. It could contain multiple emails, eg. 'sample@sample.com,sample2@sample.com'`
        })
        .option('alert_rate_count', {
          description: `Override the exported alert rate count`
        })
        .option('alert_rate_range', {
          choices: ['day', 'hour'],
          description: `Override the exported alert rate range`
        })
        .option('alert_limit_count', {
          description: `Override the exported alert limit count`
        })
        .option('alert_limit_range', {
          choices: ['day', 'hour'],
          description: `Override the exported alert limit range`
        })
        .demand('target_account_key')
        .argv
    })
    .demand(1)
    .epilog('copyright 2016')
    .argv;


let command = argv._[0];
let options = _.mapKeys(argv, (v, key) => _.camelCase(key));

co(function*() {
  try {
    yield scripts[command](options);
  } catch(err) {
    logError(err);
  }
}).catch(function(err) {
  logError(err);
});


