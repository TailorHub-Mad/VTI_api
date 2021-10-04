import { getPagination } from '@utils/controllers.utils';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { PopulateOptions } from 'mongoose';
import { GenericModel } from '../interfaces/models.interface';
import { filterClient } from '../services/client.service';

export const FilterClient =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M,
		validate: Joi.ObjectSchema<Partial<Doc>> | Joi.ArraySchema,
		populate?: PopulateOptions
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const pagination = getPagination(req.query);
			const clients = await filterClient<Doc, M>(model, validate, req.query, pagination, populate);
			res.status(200).json(clients);
		} catch (err) {
			next(err);
		}
	};
