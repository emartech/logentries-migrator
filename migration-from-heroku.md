## Migration from Heroku LE to a dedicated LE account

### 1. Creating Logs on the dedicated account
You should create a new Logset and the new logs in the dedicated account. In the migration process you could move the settings of an existing logentries account to multiple logs in the new account. Usually we create a Logset with the name of the related service, a log with the same name in it and another with the `Staging` postfix for the staging environment.

Fill out the log creation form with the following:
- *Log entries are sent via:* Plain TCP, UDP
- *Retain log entries for:* Default time period
- *Log type is:* heroku

After the creation you'll get the port and a suggested api endpoint for the log drain. The only important thing to remember is the port so save it somewhere.

### 2. Add log drains
To bind the dedicated account to the service's log drain you should use the [Heroku toolbelt](https://toolbelt.heroku.com/)'s `drains:add` command.

The log drain should be added to the `api.logentries.com` server (not the one provided by the log creation page!) and to use TLS encryption you should replace the first number in the port to 2!

So if you got `12345` in the log creation page then you should run the following command:

```bash
heroku drains:add syslog+tls://api.logentries.com:22345 --app your-heroku-application-name
```

You should create a log for the other environments as well, like the staging. If the service environments are successfully bound to the LE account you should see the logs coming.

### 3. Migrate tags and alerts from the old account
Use the migration tool to get the settings from the old account. For the migration you have to know the account keys which you can find on the Account/Profile page and under the Notifications. 

It's advised to save a backup from the old account while migrating using the `--output` parameter.

You could redefine here all of the alert settings, eg. it's a good place to change the email targets and the alert limits.

**To migrate a Heroku alert configuration to all of the logs of a Logset with backup**
```bash
logentries-migrator import --account-key 123-33d-213sf --target_account_key 245b74-h69x-435 --log_set "My Service" --output "logentries_my_service_backup.json"
```

**To migrate a default Heroku alert configuration to all of the logs of a Logset with a more sense alert rate**
```bash
logentries-migrator import --input heroku-defaults.json --alert_emails "your-team@your-company.com" --log_set "My Service" --target_account_key 23v45b74-h69x-4375 --alert_limit_count 6 --alert_limit_range "hour" --output "logentries_my_service_backup.json"
```

You could find other migration settings in the [readme](https://github.com/emartech/logentries-migrator/blob/master/README.md).
