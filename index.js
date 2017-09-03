const get = require('get');

const ProcessPDF = require('./lib/process-pdf');

const pdfGet = get('http://oldweb.rockfordil.gov/PDReports/72-Hour%20CFS%20Log.pdf');
const processor = new ProcessPDF();

pdfGet.asBuffer((err, data) => processor.load(data));

processor.completed.then(() => console.log(processor.updated, processor.dispatchEvents));
