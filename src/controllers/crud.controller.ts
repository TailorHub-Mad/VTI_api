import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { getAll, getAllAggregate } from '../services/crud.service';
import { getPagination } from '../utils/controllers.utils';

// Creamos un controlador genérico usando una interface T que tendrá el valor del modelo que nosotros le pasemos.
export const GetAll =
	<T>(model: Model<T>): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const pagination = getPagination(req.query);
			const result = await getAll(model, pagination);
			res.status(200).json(result);
		} catch (err) {
			logger.error(`Error get all ${model.collection.name}`);
			next(err);
		}
	};

export const GetAllAggregate =
	(field?: string): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const pagination = getPagination(req.query);
			const result = await getAllAggregate(pagination, field);
			res.json(result);
		} catch (err) {
			next(err);
		}
	};
