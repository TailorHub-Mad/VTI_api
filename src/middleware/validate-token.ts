import { EXCEPTION_PATH } from '@constants/routes.constants';
import { BaseError } from '@errors/base.error';
import { removeBearer } from '@utils/string.util';
import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../services/jwt.service';

export const validateToken = (req: Request, _res: Response, next: NextFunction): void => {
	const { authorization } = req.headers;
	try {
		if (EXCEPTION_PATH.includes(req.path)) return next();
		if (!authorization) throw new BaseError('No authorization', 401);

		const { sub, email, role } = verifyJWT(removeBearer(authorization));
		if (typeof sub === 'string') {
			req.user = { id: sub, email, role };
		}
		next();
	} catch (error) {
		error.status = 401;
		next(error);
	}
};
