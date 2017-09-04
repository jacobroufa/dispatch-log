const mysql = require('mysql');

class DB {
	constructor() {
		this.db = mysql.createConnection({
			database: process.env.DISPATCH_DB,
			password: process.env.DISPATCH_DB_PASS,
			user: process.env.DISPATCH_DB_USER
		});
	}

	getNewestId() {
		const query = 'SELECT MAX(event_number) AS eid FROM events';

		return this.promisify(query);
	}

	insertEvents(events) {
		if (!events.length) {
			return Promise.reject('Database up to date');
		}

		const query = events.reduce((q, event, i) => {
			let ddt = new Date(event.dispatch_date_time);
			let dateTime = ddt.getFullYear() + '-' +
				this.leftPad(ddt.getMonth()+1) + '-' +
				this.leftPad(ddt.getDate()) + ' ' + 
				this.leftPad(ddt.getHours()) + ':' + 
				this.leftPad(ddt.getMinutes()) + ':' + 
				this.leftPad(ddt.getSeconds());

			q += `("${event.event_number}","${event.full_address}","${event.city}","${event.district}","${dateTime}","${event.incident_type}")${i + 1 !== events.length ? ',' : ';'}`;

			return q;
		}, `INSERT INTO events (${ Object.keys(events[0]) }) VALUES `);

		return this.promisify(query);
	}

	promisify(query) {
		return new Promise((resolve, reject) => {
			this.db.query(query, (err, res) => {
				if (err) {
					reject(err);
				}

				resolve(res);
			});
		});
	}

	leftPad(num) {
		return ('00' + num).slice(-2);
	}
}

module.exports = DB;
