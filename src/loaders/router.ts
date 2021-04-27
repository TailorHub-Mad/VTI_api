import { Application } from 'express';
import * as routes from '../router';
import { IRouter } from '../interfaces';
import { PREFIX_API_URL } from '@constants/routes.constants';

export const router = (app: Application): void => {
	Object.values(routes).forEach((router: IRouter) =>
		app.use(PREFIX_API_URL + router.path, router.router)
	);
};
