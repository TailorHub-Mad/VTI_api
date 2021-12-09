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
			const _query = { ...query };
			if (req.user.role !== 'admin') {
				_query.public = true;
			}
			if (req.query.object) {
				_query.object = req.query.object;
			}
			const document = await read<IFilterDocument>(FilterModel, _query, pagination);
			res.status(200).json(document);
		} catch (err) {
			logger.error(`Error read ${FilterModel.collection.name}`);
			next(err);
		}
	};
