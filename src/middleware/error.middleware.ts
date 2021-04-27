import { NextFunction, Request, Response } from 'express';
import { IError } from '../interfaces';

export const errorHandler = (
	error: IError,
	_req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_next: NextFunction
): void => {
	let status = error.status || 500;
	if (
		Object.keys(error)[0] === '_original' ||
		error.name === 'MongoError' ||
		error.name === 'ValidationError'
	) {
		status = 400;
	}
	error.message = error.message || 'Something went wrong';
	logger.error(error);
	res.status(status).json(error);
};
