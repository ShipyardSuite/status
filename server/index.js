'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const winston = require('winston');
const Redis = require('winston-redis');

/**
 * Main application class.
 * @class App
 */
class App {
	/** @constructor */
	constructor() {
		this.app = express();
		this.serviceName = process.env.SERVICE_NAME || 'default';
		this.servicePort = process.env.SERVICE_PORT || 3000;
		this.logger;
	}

	/**
	 * Initialize Application.
	 * @method init
	 */
	init() {
		this.configLogger();
		this.config();
		this.apiRoutes();
		this.reactRoutes();
		this.start();
	}

	/**
	 * Configure Redis-Logger.
	 * @method configLogger
	 */
	configLogger() {
		this.logger = winston.createLogger({
			format: winston.format.timestamp(),
			defaultMeta: { service: process.env.SERVICE_NAME },
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss a' }),
						winston.format.colorize(),
						winston.format.simple(),
						winston.format.printf(
							(info) => `${info.timestamp} | ${info.level} | ${info.service} | ${info.message}`
						)
					)
				}),
				new Redis({
					host: 'redis',
					port: 6379,
					container: 'logs',
					expire: 7 * 24 * 60 * 60
				})
			]
		});
	}

	/**
	 * Configure Express middleware.
	 * @method config
	 */
	config() {
		this.app.use(`/${this.serviceName}/public`, require('express').static(require('path').join('public')));
		// this.app.use('/uploads', require('express').static(require('path').join('uploads')));
		this.app.use(require('express').urlencoded({ extended: true }));
		this.app.use(require('express').json());
		this.app.use(cors());
	}

	/**
	 * Read API routes from /api/directory, if more than 1 route exists.
	 * @method apiRoutes
	 */
	apiRoutes() {
		fs.readdirSync(__dirname + '/api/').forEach((file, i, allRoutes) => {
			if (allRoutes.length > 0) {
				require(`./api/${file.substr(0, file.indexOf('.'))}`)(this.app, this.logger, this.serviceName);
			}
		});
	}

	/**
	 * Parse react components to Application.
	 * @method reactRoutes
	 */
	reactRoutes() {
		this.app.get(`/${this.serviceName}/*`, (req, res) => {
			const content = fs.readFileSync(path.resolve(__dirname, './../public/index.html')).toString();
			res.set('content-type', 'text/html');
			res.send(content);
			res.end();
		});
	}

	/**
	 * Start express server and parse an information message to the console.
	 * @method start
	 */
	start() {
		this.app.listen(this.servicePort, () => {
			this.logger.info(`Service "${this.serviceName}" listening on port ${this.servicePort}`);
		});
	}
}

// Create an instance of the Application and initialize it.
const application = new App();
application.init();
