import 'dotenv/config';

import * as http from 'http';
import express from 'express';
import { PORT } from '@constants/env.constants';
import logger from '@log';
import cors from 'cors';
import helmet from 'helmet';
import * as loaders from './loaders';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { errorHandler } from './middleware/error.middleware';
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
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(express.json());
app.use(loaders.morganMiddleware);

app.get('/', async (_req, res) => {
	res.json({ status: 'ok' });
});

loaders.mongodb();
loaders.middlewares(app);
loaders.router(app);
app.use(errorHandler);
const server = http.createServer(app);
server.listen(PORT, () => {
	logger.info(`${packageJson.name} ${packageJson.version} listening on port ${PORT}!`);
	logger.info(`PROD mode is ${process.env.NODE_ENV === 'production' ? 'ON' : 'OFF'}`);
	logger.info(`Running on port ${PORT}`);
});

server.on('error', loaders.onError);
