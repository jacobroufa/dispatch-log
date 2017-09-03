const fs = require('fs');
const path = require('path');

const PDF = require('pdf2json');

class ProcessPDF {
	constructor() {
		const parser = this.parser = new PDF();

		parser.on('pdfParser_dataError', error => console.error(error.parserError));

		parser.on('pdfParser_dataReady', this.pageData.bind(this));

		this.completeOperation = null;
		this.completed = new Promise((resolve, reject) => {
			this.completeOperation = resolve;
		});
	}

	load(pdfBuffer) {
		this.parser.parseBuffer(pdfBuffer);
	}

	pageData(data) {
		const pages = data.formImage.Pages;
		const numPages = pages.length;

		let dispatchEvents = this.dispatchEvents = [];

		console.log(numPages + ' pages total');

		pages.forEach((page, i) => {
			console.log('processing page ' + i);
			dispatchEvents = dispatchEvents.concat(this.processPages(page.Texts, 6));
		});

		// console.log(this.dispatchEvents, dispatchEvents);
		this.completeOperation();
	}

	processPages(page, cols) {
		let initialRow = false;
		let labelsSet = false;
		let updateTime = false;
		let place = 0;
		let labels = [];
		let rows = [];
		let row = {};
		let lastCell;

		page.forEach(mark => {
			if (place >= cols && labels.length === cols && updateTime) {
				rows.push(row);
				row = {};
				place = 0;
			}

			mark.R.forEach((cell) => {
				let cellText = this.cleanText(cell.T) || '';
				let updatedCell = cellText.indexOf('Report') > -1;

				if (cellText === 'Event_Number') {
					initialRow = true;
				}

				if (initialRow && labels.length <= cols) {
					if (cellText === 'Time' || cellText === 'Type') {
						labels.push(labels.pop() + ' ' + cellText);
					} else {
						labels.push(cellText);
					}
				}

				if (labels.length === cols && labels.slice(-1)[0] === 'Incident Type') {
					initialRow = false;
					labelsSet = true;
				}

				if (!initialRow && labelsSet && !updateTime && updatedCell) {
					console.log(cellText);
					this.updated = cellText;
					updateTime = true;
				}

				if (!initialRow && labelsSet && updateTime && !updatedCell) {
					if (place === 0 && cellText.match(/[0-9]{2}-/) !== null) {
						lastCell += cellText;
						place--;
						return;
					}

					if (place === 1 && cellText.match(/[A-Z]/) === null || // event number is always in two parts
						place === 2 && cellText !== 'Rockford' || // sometimes the address is split
						place === 5 && cellText.match(/[0-9]/) !== null || // sometimes datetime is split
						place === 6 && cellText.match(/[A-Z]/) !== null // sometimes type is split
					) {
						place--;
						row[labels[place]] += cellText;
					} else {
						row[labels[place]] = cellText;
					}
				}

				lastCell = cellText;
			});

			place++;
		});

		return rows;
	}

	cleanText(text) {
		return decodeURIComponent(text.replace(/\+/g, ' ')).trim();
	}
}

module.exports = ProcessPDF;
