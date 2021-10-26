import {
	SUBSCRIBED_NOTE,
	SUBSCRIBED_NOTE_POPULATE,
	SUBSCRIBED_PROJECT,
	SUBSCRIBED_PROJECT_POPULATE,
	SUBSCRIBED_TESTSYSTEM,
	SUBSCRIBED_TESTSYSTEM_POPULATE
} from '@constants/subscribed.constanst';
import { getPagination, purgeObj } from '@utils/index';
import { OrderAggregate } from '@utils/order.utils';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { UserModel } from '../models/user.model';

export const GetAllSubscribed = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const pagination = getPagination(req.query);
		delete req.query.offset;
		delete req.query.limit;
		const query = Object.entries(req.query).reduce((query, [key, value]) => {
			if (value === 'desc' || value === 'asc' || value === 'des') {
				return query;
			}
			query.push({ [key]: { $regex: `${value}`, $options: 'i' } });
			return query;
		}, [] as { [key: string]: { $regex: string; $options: string } }[]);
		const users = await UserModel.aggregate([
			...SUBSCRIBED_PROJECT,
			...SUBSCRIBED_TESTSYSTEM,
			...SUBSCRIBED_NOTE,
			{
				$project: {
					password: 0
				}
			},
			{
				$match: query.length > 0 ? { $or: query } : {}
			},
			{
				$match: {
					$expr: {
						$or: [
							{
								$not: {
									$eq: [{ $size: '$subscribed.notes' }, 0]
								}
							},
							{
								$not: {
									$eq: [{ $size: '$subscribed.projects' }, 0]
								}
							},
							{
								$not: {
									$eq: [{ $size: '$subscribed.testSystems' }, 0]
								}
							}
						]
					}
				}
			},
			{
				$sort: purgeObj(
					Object.assign({}, new OrderAggregate(req.query as { [key: string]: 'asc' | 'desc' }))
				) || { createdAt: -1 }
			},
			{
				$limit: pagination.limit || 100
			},
			{
				$skip: pagination.offset || 0
			}
		]);

		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};
export const GetNotesSubscribed = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const pagination = getPagination(req.query);
		delete req.query.offset;
		delete req.query.limit;
		const users = await UserModel.aggregate([
			...SUBSCRIBED_NOTE_POPULATE(req.query.title as string),
			{
				$project: {
					password: 0
				}
			},
			{
				$match: req.user.role === 'admin' ? {} : { _id: Types.ObjectId(req.user.id) }
			},
			{
				$limit: pagination.limit || 100
			},
			{
				$skip: pagination.offset || 0
			}
		]);
		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};
export const GetProjectsSubscribed = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const pagination = getPagination(req.query);
		delete req.query.offset;
		delete req.query.limit;
		const users = await UserModel.aggregate([
			...SUBSCRIBED_PROJECT_POPULATE(req.query.alias as string),
			{
				$project: {
					password: 0
				}
			},
			{
				$match: req.user.role === 'admin' ? {} : { _id: Types.ObjectId(req.user.id) }
			},
			{
				$limit: pagination.limit || 100
			},
			{
				$skip: pagination.offset || 0
			}
		]);
		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};
export const GetTestSystemsSubscribed = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const pagination = getPagination(req.query);
		delete req.query.offset;
		delete req.query.limit;
		const users = await UserModel.aggregate([
			...SUBSCRIBED_TESTSYSTEM_POPULATE(req.query.alias as string),
			{
				$project: {
					password: 0
				}
			},
			{
				$match: req.user.role === 'admin' ? {} : { _id: Types.ObjectId(req.user.id) }
			},
			{
				$limit: pagination.limit || 100
			},
			{
				$skip: pagination.offset || 0
			}
		]);
		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};
