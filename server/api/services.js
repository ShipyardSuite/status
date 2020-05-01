'use strict';

const fetch = require('node-fetch');

module.exports = (app, logger, serviceName) => {
	/**
	 * @todo Fix gateway port for service connection
	 * @body Most likley, the gateway cannot be reached outside of the docker-network, so it should be implemented into it.
	 */
	// Get all services from gateway
	app.get(`/${serviceName}/api/list/services`, async (req, res) => {
		await fetch('http://gateway:9876/service-endpoints')
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
