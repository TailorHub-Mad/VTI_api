import morgan, { StreamOptions } from 'morgan';
import { Request, Response } from 'express';

import looger from './log.loader';

const stream: StreamOptions = {
	write: (message) => looger.http(message)
};

const skip = (_req: Request, res: Response) => {
	const env = process.env.NODE_ENV || 'development';
	return env !== 'development' && res.statusCode < 400;
};

export const morganMiddleware = morgan(
	':method :url :status :res[content-length] - :response-time ms',
	{
		stream,
		skip
	}
);
