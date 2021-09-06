import { Document, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { GenericModel } from '../interfaces/models.interface';
import { Pagination } from '../interfaces/config.interface';

// Este repository nos dejará buscar por cualquier modelo y nos devolvera con su interfece corresponiente.
export const findWithPagination = async <Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
	model: M,
	find: FilterQuery<Doc>,
	pagination: Pagination,
	select = ''
): Promise<Doc[]> => {
	return await model.find(find).limit(pagination.limit).skip(pagination.offset).select(select);
};

export const findOneRepository = async <
	Doc extends Document,
	M extends GenericModel<Doc> = GenericModel<Doc>
>(
	model: M,
	query: FilterQuery<Doc>,
	projection?: unknown
): Promise<Doc | null> => {
	return await model.findOne(query, projection);
};

export const createRepository = async <Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
	Model: M,
	body: Partial<unknown>
): Promise<Doc> => {
	const newDocumet = new Model(body);
	return await newDocumet.save();
};

export const updateRepository = async <Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
	model: M,
	query: FilterQuery<Document>,
	update: UpdateQuery<Doc>,
	options?: QueryOptions
): Promise<Doc | null> => {
	return await model.findOneAndUpdate(query, update, {
		new: true,
		timestamps: true,
		...options
	});
};

export const deleteRepository = async <Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
	model: M,
	filter: FilterQuery<Document>
): Promise<Doc | null> => {
	return await model.findOneAndRemove(filter);
};
