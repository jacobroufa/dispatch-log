# Dispatch Logs

Built as a response to the [RPD announcement](https://rockfordil.gov/wp-content/uploads/2016/11/Rockford-Police-Announce-72-Hour-Dispatch-Call-Log-Update.pdf) that they are no longer updating information on the [data.illinois.gov](https://data.illinois.gov/dataset/639rockford_police_department_72_hour_dispatch_call_log) portal provided by the state. RPD sees fit to publish this information now instead of a browsable usable database as a [PDF document](http://oldweb.rockfordil.gov/PDReports/72-Hour%20CFS%20Log.pdf) which is impractical to reason about.

This is a first run through at parsing the data; there are still some kinks to be worked out. As soon as I am able to smooth it out, I intend to host this database myself. That will be forthcoming.

## Local Installation

* clone repository and `cd dispatch-log`
* run `npm install`
* run `npm start`

You might want to run `npm run dev` instead, in order to inspect the parsed dataset, as currently nothing is being saved to a database.

## License

Copyright (c) 2017 Jacob M. Roufa jacob.roufa@gmail.com Licensed under the MIT license.
