import { EnforceDocument, FilterQuery, Model } from 'mongoose';
import { GenericModel } from 'src/interfaces/models.interface';
import { Pagination } from '../interfaces/config.interface';

// Este repository nos dejará buscar por cualquier modelo y nos devolvera con su interfece corresponiente.
export const findWithPagination = async <T>(
	model: Model<T>,
	find: FilterQuery<T>,
	pagination: Pagination
): Promise<EnforceDocument<T, unknown>[]> => {
	return await model.find(find).skip(pagination.offset).limit(pagination.limit);
};

export const createRepository = async <Doc, M extends GenericModel<Doc> = GenericModel<Doc>>(
	Model: M,
	body: Partial<Doc>
): Promise<Doc> => {
	const newDocumet = new Model(body);
	return await newDocumet.save();
};

// export const createRepository = async <T, DocType = Document & T>(
// 	Model: Model<T>,
// 	body: Partial<T>
// ): Promise<DocType> => {
// 	const newDocumet = new Model(body);
// 	return await newDocumet.save();
// };
