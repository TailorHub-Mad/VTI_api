import 'dotenv/config';

import * as http from 'http';
import express from 'express';
import { PORT } from '@constants/env.constants';
import cors from 'cors';
import helmet from 'helmet';
import * as loaders from './loaders';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { errorHandler } from './middleware/error.middleware';
import dbLoader from './loaders/db.loader';
import { cronjobs } from '@utils/cronjobs.utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');

const app = express();

app.use(
	cors({
		origin: true,
		credentials: true
	})
);

app.use(helmet());

app.use((_req, res, next) => {
	res.setHeader('Permissions-Policy', 'geolocation=(), interest-cohort=()'); // TODO: update  geolocation=(self "https://example.com"), microphone=()
	next();
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(express.json());
app.use(loaders.morganMiddleware);

loaders.middlewares(app);
loaders.router(app);
app.use(errorHandler);

// redisLoader
// 	.open()
// 	.then(() => {
// })
dbLoader
	.open()
	.then(() => {
		const server = http.createServer(app);
		return server;
	})
	.then((server) => {
		server.listen(PORT, () => {
			logger.info(`${packageJson.name} ${packageJson.version} listening on port ${PORT}!`);
			logger.info(`PROD mode is ${process.env.NODE_ENV === 'production' ? 'ON' : 'OFF'}`);
			logger.info(`Running on port ${PORT}`);
			cronjobs();
		});

		process.on('SIGINT', function () {
			console.error('Caught SIGINT, shutting down.');
			server.close();
		});

		server.on('error', loaders.onError);
	})
	.catch((err) => logger.error(`Error: ${err}`));
