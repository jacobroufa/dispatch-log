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
			// lets us call this.completeOperation(value) later on to resolve the promise and resume processing
			this.completeOperation = resolve;
		});
	}

	load(pdfBuffer) {
		this.parser.parseBuffer(pdfBuffer);
	}

	pageData(data) {
		const pages = data.formImage.Pages;
		const numPages = pages.length;

		let dispatchEvents = [];

		console.log(numPages + ' pages total');

		pages.forEach((page, i) => {
			console.log('processing page ' + i);
			dispatchEvents = dispatchEvents.concat(this.processPages(page.Texts, 6));
		});

		this.completeOperation(dispatchEvents);
	}

	processPages(page, cols) {
		let initialRow = false;
		let labelsSet = false;
		let updateTime = false;
		let place = 0;
		let labels = [];
		let rows = [];
		let row = {};

		this.updated = '';

		page.forEach((mark, markIndex) => {
			if (place > cols && labels.length === cols && updateTime) {
				if (row['event_number']) {
					rows.push(row);
				}
				row = {};
				place = 0;
			}

			mark.R.forEach((cell) => {
				let cellText = this.cleanText(cell.T) || '';
				let updatedCell = cellText.indexOf('Report') > -1;
				let isNotEventNumber = place === 1 && cellText.match(/[A-Z]/) === null && !this.isEventNumber(row[labels[place - 1]]);
				let nextPage = page[markIndex + 1];
				let nextCell = nextPage && this.cleanText(nextPage.R[0].T);
				let nextRowStartsNext = nextCell && nextCell.match(/[0-9]{2}-/) !== null;

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

					labels = labels.map(this.keyify);
				}

				if (!initialRow && labelsSet && !updateTime && updatedCell || this.updated) {
					this.updated += cellText;

					if (nextRowStartsNext) {
						updateTime = true;
					}
				}

				if (!initialRow && labelsSet && updateTime && !updatedCell) {
					let nextCellIsWalkIn = nextCell && nextCell === 'Walk-in Report';

					if (place === 3 && cellText.match(/^[A-Z]{2}[0-9]{2}$/) === null) {
						row[labels[place]] = '';
						place++;
					}

					if (isNotEventNumber || // event number is always in two parts
						place === 2 && cellText !== 'Rockford' || // sometimes the address is split
						place === 5 && cellText.match(/[0-9]/) !== null && !this.isDateTime(row[labels[place - 1]]) || // sometimes datetime is split
						place === 6 && cellText.match(/[A-Z]/) !== null // sometimes type is split
					) {
						place--;
						row[labels[place]] += (isNotEventNumber ? '' : ' ') + cellText;
					} else {
						row[labels[place]] = cellText;
					}

					// if we went through the stack and didn't have to concat fields, place will be 5
					// potentially letting this iterate through and remove event_number prefix from next row
					if (place === 5 && nextRowStartsNext) {
						place++;
					}

					// for some reason, the array iteration skips these, resulting in event_number prefix dropping
					if (place === 4 && nextCellIsWalkIn) {
						row['incident_type'] = nextCell;
						place = 6;
					}
				}
			});

			place++;
		});

		return rows;
	}

	cleanText(text) {
		return decodeURIComponent(text.replace(/\+/g, ' ')).trim();
	}

	isDateTime(text) {
		// requires text formatted like `2017-09-03 15:22:00`
		return text && text.match(/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/) === null ? false : true;
	}

	isEventNumber(text) {
		// requires text formatted like `17-123456`
		return text && text.match(/[0-9]{2}-[0-9]{6}/) === null ? false : true;
	}

	keyify(str) {
		return str.split(/[^a-zA-Z0-9]/).filter((s) => s.length).map((s) => s.toLowerCase()).join('_');
	}
}

module.exports = ProcessPDF;
