'use strict';

const path = require('path');
const express = require('express');
const fs = require('fs');

require('dotenv').config();

const dist = path.join(__dirname, 'dist');
const port = process.env.SERVICE_PORT;
const service = process.env.SERVICE_NAME;
const app = express();

//Serving the files on the dist folder
app.use(express.static(dist));

app.get(`/${service}/services/`, (req, res) => {
	fs.readFile('./services.json', 'utf8', (err, jsonString) => {
		if (err) {
			res.json({ success: false, data: [] });
		}

		res.json({ success: true, data: JSON.parse(jsonString) });
	});
});

//Send index.html when the user access the web
app.get('*', (req, res) => {
	res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port, (err) => {
	if (err) {
		console.log(err);
	}

	console.log(`Express server listening on port ${port.toString()}!`);
});
