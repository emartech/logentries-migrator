# logentries-migrator
Import-export tags and alerts from a Logentries account to an other.

##Features

- export tags and alerts from an account into a file
- import tags and alerts into an account from a file or an other account
- skip the demo tags
- change alerts target emails on import
- change alert rate and report settings on import
- attach tags and alerts to a log or to a whole logset
- prevent tag duplication (if there is one with the same name)

## Usage
The migrator requires a working `NodeJS >= 4` environment and an NPM install.

```bash
npm install
chmod +x ./migrator
```

All migration commands need an account id which you can find in the Logentries UI *Account settings / Profile / Account key*. 

### Export
You can export alerts and tags from an account in `json` format. It could be used as a backup or a source for importing later.

`migrator export --account_key 11111111-2222-3333-4444-555555555555 --output output.json`

#### Arguments
```bash
--account_key  Account key to get the data from                     [required]
--output       Filename to export the data                          [required]
--help         Show help                                             [boolean]
```

### Import
You can import alerts and tags from an account directly or from a previously saved `json` file. You can also save the exported settings to a file without using the `export` command explicitly.

`migrator import --account_key 11111111-2222-3333-4444-555555555555 --target_account_key 91111111-2222-3333-4444-555555555555 --log_set 'Sample logset' --log 'Sample logs' --alert_emails 'sample@sample.com' --alert_rate_count 11 --alert_rate_range 'hour' --alert_limit_count 22 --alert_limit_range 'hour' --output 'backup.json'`

#### Arguments

```bash
--account_key         Account key to get the data from. This or the input
                      argument should be provided!
--output              Filename to dump the exported data to later use
--input               Filename for import the data from. This or the
                      account_key argument should be provided!
--target_account_key  The account key to import the data            [required]
--log_set             Add the alerts to the logs of the specified log set
--log                 Add the alerts to a log. The log_set argument should be
                      provided to use this option!
--alert_emails        Set the direct mail alerts to the specified email
                      instead of the exported one. It could contain multiple
                      emails, eg. 'sample@sample.com,sample2@sample.com'
--alert_rate_count    Override the exported alert rate count
--alert_rate_range    Override the exported alert rate range [choices: "day", "hour"]
--alert_limit_count   Override the exported alert limit count
--alert_limit_range   Override the exported alert limit range [choices: "day", "hour"]
```

### Import default Heroku tags & alerts
For a new Heroku app it's good to have predefined alerts and tags for the Heroku error codes. You can find a `heroku-defaults.json` in the repository root which contains default settings for all of these. If you are importing these defaults make sure that you provided an email address otherwise there will be e-mail alerts to a not existing mailbox.   

```migrator import --input heroku-defaults.json --alert_emails "EMAIL_FOR_ALERTS" --log_set "YOUR_LOG_SET" --target_account_key YOUR_ACCOUNT_ID```
