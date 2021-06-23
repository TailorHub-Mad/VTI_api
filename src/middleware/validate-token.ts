import { removeBearer } from '@utils/string.util';
import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../services/jwt.service';

export const validateToken = (req: Request, _res: Response, next: NextFunction): void => {
	const { authorization } = req.headers;
	if (authorization) {
		try {
			const { sub } = verifyJWT(removeBearer(authorization));
			if (typeof sub === 'string') {
				req.user = { id: sub };
			}
		} catch (error) {
			next(error);
		}
	}
	next();
};