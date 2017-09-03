const get = require('get');

const ProcessPDF = require('./lib/process-pdf');

const pdfGet = get('http://oldweb.rockfordil.gov/PDReports/72-Hour%20CFS%20Log.pdf');
const processor = new ProcessPDF();

pdfGet.asBuffer((err, data) => processor.load(data));

processor.completed.then((dispatchEvents) => {
	console.log(processor.updated, dispatchEvents)
	// TODO: after paring down the data to only what doesn't exist in the db yet
	// (pseudocode) db.get(newestRow.date) && dispatchEvents.filter(({ date }) => date > newestRow.date)
	// TODO: do a db write of the filtered dataset
});
