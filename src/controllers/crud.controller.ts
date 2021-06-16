import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { getAll } from '../services/crud.service';

// Creamos un controlador genérico usando una interface T que tendrá el valor del modelo que nosotros le pasemos.
export const GetAll =
	<T>(model: Model<T>): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { offset = 0, limit = 0 } = req.query;
			const result = await getAll(model, { offset: +offset, limit: +limit });
			res.status(200).json(result);
		} catch (err) {
			logger.error(`Error get all ${model.collection.name}`);
			next(err);
		}
	};
