# Dispatch Logs

Built as a response to the [RPD announcement](https://rockfordil.gov/wp-content/uploads/2016/11/Rockford-Police-Announce-72-Hour-Dispatch-Call-Log-Update.pdf) that they are no longer updating information on the [data.illinois.gov](https://data.illinois.gov/dataset/639rockford_police_department_72_hour_dispatch_call_log) portal provided by the state. RPD sees fit to publish this information now instead of a browsable usable database as a [PDF document](http://oldweb.rockfordil.gov/PDReports/72-Hour%20CFS%20Log.pdf) which is impractical to reason about.

## Status

The parser seems to be working (though it'll need some more runs through to work out any potential bugs). Currently there is database support, so I intend to get this installed on a server, running on a cron job every hour, and build a simple front end through which to browse, filter, and search the data.

## Local Installation

* clone repository and `cd dispatch-log`
* run `npm install`
* `cp db/start.sh.example db/start.sh` and modify the `DISPATCH_DB*` variables to suit your environment
* run `npm start` or set up a cron job to run the `start.sh` script

## License

Copyright (c) 2017 Jacob M. Roufa jacob.roufa@gmail.com Licensed under the MIT license.
