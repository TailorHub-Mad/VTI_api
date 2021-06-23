import { Request, Response, NextFunction } from 'express';
import { login, signup } from '../services/auth.service';

export const SignUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { body } = req;
		const user = await signup(body);
		res.status(201).json(user);
	} catch (err) {
		next(err);
	}
};

export const Login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { body } = req;
		const user = await login(body);
		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};
