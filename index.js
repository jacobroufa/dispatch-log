const get = require('get');

const ProcessPDF = require('./lib/process-pdf');
const DB = require('./lib/db.js');

const pdfGet = get('http://oldweb.rockfordil.gov/PDReports/72-Hour%20CFS%20Log.pdf');

const processor = new ProcessPDF();
const db = new DB();

pdfGet.asBuffer((err, data) => processor.load(data));

processor.completed.then((dispatchEvents) => {
	return db.getNewestId().then((id) => {
		let eid = id[0].eid || '17-0';

		return db.insertEvents(dispatchEvents.filter(({ event_number }) => event_number > eid));
	});
}).then((res) => {
	console.log(res);
	process.exit();
}, (err) => {
	console.log(err);
	process.exit();
});
