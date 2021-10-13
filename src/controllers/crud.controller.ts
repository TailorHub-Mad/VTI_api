import { Request, Response, NextFunction, query } from 'express';
import Joi from 'joi';
import {
	create,
	deleteCrud,
	getAll,
	getAllAggregate,
	getByIdAggregate,
	getByQueryAggregate,
	read,
	update
} from '../services/crud.service';
import { getPagination } from '../utils/controllers.utils';
import { GenericModel } from '../interfaces/models.interface';
import { BaseError } from '@errors/base.error';
import { FilterQuery, isValidObjectId, PopulateOptions } from 'mongoose';
import { OrderAggregate } from '@utils/order.utils';
import { purgeObj } from '@utils/index';
import { groupAggregate } from '@utils/aggregate.utils';

// Creamos un controlador genérico usando una interface T que tendrá el valor del modelo que nosotros le pasemos.
export const GetAll =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M,
		populate?: PopulateOptions
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const pagination = getPagination(req.query);
			let results = await getAll<Doc, M>(model, pagination, {
				populate,
				order: purgeObj(
					Object.assign({}, new OrderAggregate(req.query as { [key: string]: 'asc' | 'desc' }))
				)
			});
			if (req.query.group) {
				results = groupAggregate(
					results.map((result) => ({ aux: result })),
					{
						group: req.query.group as string,
						field: req.query.group as string,
						real: true
					}
				);
			}
			res.status(200).json(results);
		} catch (err) {
			logger.error(`Error get all ${model.collection.name}`);
			next(err);
		}
	};

export const Create =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M,
		validate: Joi.ObjectSchema<Partial<Doc>> | Joi.ArraySchema
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { body } = req;
			await create<Doc, M>(model, validate, body);
			res.sendStatus(201);
		} catch (err) {
			logger.error(`Error created ${model.collection.name}`);
			next(err);
		}
	};

export const Read =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M,
		query: FilterQuery<Document>,
		populate?: PopulateOptions
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const pagination = getPagination(req.query);
			const document = await read<Doc, M>(model, query, pagination, { populate });
			res.status(200).json(document);
		} catch (err) {
			logger.error(`Error read ${model.collection.name}`);
			next(err);
		}
	};

export const ReadById =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M,
		populate?: PopulateOptions
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { id } = req.params;
			if (!id || !isValidObjectId(id)) throw new BaseError('Not ID');
			const document = (
				await read<Doc, M>(model, { _id: id }, { offset: 0, limit: 0 }, { populate })
			)[0];
			if (!document) {
				throw new BaseError(`Error read by id in ${model.collection.name}`);
			}
			res.status(200).json(document);
		} catch (err) {
			logger.error(`Error read by id in ${model.collection.name}`);
			next(err);
		}
	};

export const Update =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M,
		validate: Joi.ObjectSchema<Partial<Doc>>
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { body, params } = req;
			const { id } = params;
			if (!id || !isValidObjectId(id)) throw new BaseError('Not ID');
			const document = await update<Doc, M>(model, validate, { _id: id }, body);
			res.status(200).json(document);
		} catch (err) {
			logger.error(`Error update ${model.collection.name}`);
			next(err);
		}
	};

export const DeleteCrud =
	<Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
		model: M
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { id } = req.params;
			if (!id || !isValidObjectId(id)) throw new BaseError('Not ID', 400);
			await deleteCrud<Doc, M>(model, { _id: id });
			res.json(200).send();
		} catch (err) {
			next(err);
		}
	};

export const GetAllAggregate =
	(
		field?: string,
		populates?: string[]
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const pagination = getPagination(req.query);
			const result = await getAllAggregate(
				pagination,
				field,
				purgeObj(
					Object.assign({}, new OrderAggregate(req.query as { [key: string]: 'asc' | 'desc' }))
				),
				populates
			);
			res.json(result);
		} catch (err) {
			next(err);
		}
	};

export const GetByIdAggregate =
	(
		field?: string,
		populates?: string[]
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { id } = req.params;
			if (!id || !isValidObjectId(id)) throw new BaseError('Not ID');
			const result = await getByIdAggregate(id, field, populates);
			res.json(result);
		} catch (err) {
			next(err);
		}
	};

export const GetByQueryAggregate =
	(
		field?: string,
		populates?: string[]
	): ((req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { query } = req;
			const pagination = getPagination(req.query);
			delete req.query.limit;
			delete req.query.offset;
			const result = await getByQueryAggregate(query, pagination, field, populates, req.user);
			res.json(result);
		} catch (err) {
			next(err);
		}
	};
