import * as allMiddlewares from '../middleware';
import { Application } from 'express';

export const middlewares = (app: Application): void => {
	Object.values(allMiddlewares).forEach((middleware) => app.use(middleware));
};
