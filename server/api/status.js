'use strict';

const fetch = require('node-fetch');

module.exports = (app, serviceName) => {
	app.get(`/${serviceName}/api/status`, (req, res) => {
		res.json({ success: true, message: `Hello from service "${serviceName}"` });
	});

	// Get all services from gateway
	app.get(`/${serviceName}/api/list/services`, async (req, res) => {
		await fetch('http://localhost:9876/service-endpoints')
			.then((res) => res.json())
			.then((json) => {
				const serviceNames = Object.keys(json);
				const tempArray = [];
				serviceNames.forEach((serviceName, i) => {
					tempArray.push({ title: serviceName, url: json[serviceName].url });
				});
				res.json({ success: true, data: tempArray });
			})
			.catch((err) => console.error(err));
	});
};
