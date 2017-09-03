# Dispatch Logs

Built as a response to the RPD announcement that they are no longer updating information on the data.illinois.gov portal provided by the state. RPD sees fit to publish this information now instead of a browsable usable database as a PDF document which is impractical to reason about.

This is a first run through at parsing the data; there are still some kinks to be worked out. As soon as I am able to smooth it out, I intend to host this database myself. That will be forthcoming.

## Local Installation

* clone repository and `cd dispatch-log`
* run `npm install`
* run `node index.js`

You might want to run the application with the `--inspect` and `--debug-brk` flags, as currently no data is being saved.
