## Migration from Heroku LE to a dedicated LE account

### 1. Creating Logs on the dedicated account
You should create a new Logset and the new logs in the dedicated account. In the migration process you could move the settings of an existing logentries account to multiple logs in the new account. Usually we create a Logset with the name of the related service, a log with the same name in it and another with the `Staging` postfix for the staging environment.

To migrate from Heroku you should use *Manual* type of log sending.

Fill out the log creation form with the following:
- *Log entries are sent via:* Token TCP - logs are identified by a token.
- *Retain log entries for:* Default time period
- *Log type is:* heroku

After the creation you'll get the token which can be used for binding the Logentries using a Heroku log drain. You can find this token later on the *Log Host* page (click to the small list icon after hovering a host).

**Important:** you have to click on the finish button, it's not enough to get the token!

### 2. Add log drains
To bind the dedicated account to the service's log drain you should use the [Heroku toolbelt](https://toolbelt.heroku.com/)'s `drains:add` command.

So if you got the token `*TOKEN*` in the log creation page then you should run the following command:

```bash
heroku drains:add https://heroku.logentries.com/v1/drain/*TOKEN* --app your-heroku-application-name
```

You should create a log for the other environments as well, like the staging. If the service environments are successfully bound to the LE account you should see the logs coming.

You could find additional informations about the Heroku - Logentries integration in the [Logentries docs](https://logentries.com/doc/heroku/#syslog_drain).

### 3. Migrate tags and alerts from the old account
Use the migration tool to get the settings from the old account. For the migration you have to know the account keys which you can find on the Account/Profile page and under the Notifications. 

It's advised to save a backup from the old account while migrating using the `--output` parameter.

You could redefine here all of the alert settings, eg. it's a good place to change the email targets and the alert limits.

**To migrate a Heroku alert configuration to all of the logs of a Logset with backup**
```bash
logentries-migrator import --account_key 123-33d-213sf --target_account_key 245b74-h69x-435 --log_set "My Service" --output "logentries_my_service_backup.json"
```

**To migrate a default Heroku alert configuration to all of the logs of a Logset with a more sense alert rate**
```bash
logentries-migrator import --input heroku-defaults.json --alert_emails "your-team@your-company.com" --log_set "My Service" --target_account_key 23v45b74-h69x-4375 --alert_limit_count 6 --alert_limit_range "hour" --output "logentries_my_service_backup.json"
```

You could find other migration settings in the [readme](https://github.com/emartech/logentries-migrator/blob/master/README.md).
