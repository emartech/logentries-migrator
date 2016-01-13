# logentries-migrator
Import-export tags and alerts from a Logentries account to an other.

## Usage
The migrator requires a working `NodeJS > 4` environment and an NPM install.

```bash
npm install
chmod +x ./migrator
```

### Export tags and alerts from an account

```bash
Usage: migrator export --account_key 11111111-2222-3333-4444-555555555555 --output output.json

Options:
  --account_key  Account key to get the data from                     [required]
  --output       Filename to export the data                          [required]
  --help         Show help                                             [boolean]
```

### Import tags and alerts to an account
```migrator import --account_key 11111111-2222-3333-4444-555555555555 --target_account_key 91111111-2222-3333-4444-555555555555 --log_set 'Sample logset' --log 'Sample logs' --alert_emails 'sample@sample.com' --alert_rate_count 11 --alert_rate_range 'hour' --alert_limit_count 22 --alert_limit_range 'hour' --output 'backup.json'```

```bash
Options:
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

###

