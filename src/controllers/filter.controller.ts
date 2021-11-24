import { getPagination } from '@utils/controllers.utils';
import { Request, Response, NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import { IFilterDocument } from '../interfaces/models.interface';
import { FilterModel } from '../models/filter.model';
import { read } from '../services/crud.service';

export const GetFilters =
	(query: FilterQuery<Document>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const pagination = getPagination(req.query);
			console.log(req.user);
			if (req.user.role !== 'admin') {
				query.public = true;
			}
			if (req.query.object) {
				query.object = req.query.object;
			}
			const document = await read<IFilterDocument>(FilterModel, query, pagination);
			res.status(200).json(document);
		} catch (err) {
			logger.error(`Error read ${FilterModel.collection.name}`);
			next(err);
		}
	};
