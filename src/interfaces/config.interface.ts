import { NextFunction, Router } from 'express';

export interface IRouter {
	path: string;
	router: Router;
}

export interface IRouterMid extends IRouter {
	middelware: (req: Request, res: Response, next: NextFunction) => void;
}
