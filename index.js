'use strict';

const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');

const dist = path.join(__dirname, 'dist');
const port = process.env.SERVICE_PORT | 3333;
const app = express();

app.use(express.static(dist));

app.get('/status/', (req, res) => {
	res.sendFile(path.join(dist, 'index.html'));
});

app.get(`/status/services/`, async (req, res) => {
	await fetch('http://localhost:9876/service-endpoints').then((res) => res.json()).then((json) => {
		const serviceNames = Object.keys(json);

		const tempArray = [];

		serviceNames.forEach((serviceName, i) => {
			tempArray.push({ title: serviceName, url: json[serviceName].url });
		});

		res.json({ success: true, data: tempArray });
	});
});

app.listen(port, (err) => {
	if (err) {
		console.log(err);
	}

	console.log(`Express server listening on port ${port.toString()}!`);
});
