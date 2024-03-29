import { Document, Model, Types } from 'mongoose';
import { ITagProjectDocument } from '../interfaces/models.interface';
import { TagProjectModel } from '../models/tag_project.model';
import { updateRepository } from '../repositories/common.repository';
import { RefsEnum } from '../enums/client.enum';
import { findLastField } from '../repositories/client.repository';
import bcrypt from 'bcrypt';

export const transformStringToObjectId = (id: string): Types.ObjectId => {
	return Types.ObjectId(id);
};

export const createSet = (
	body: { [key: string]: unknown },
	field: string
): {
	[key: string]: unknown;
} => {
	return Object.entries(body).reduce((set, [property, value]) => {
		set[`${field}.${property}`] = value;
		return set;
	}, {} as { [key: string]: unknown });
};

export const createRef = async <T extends { ref: string }>(
	field: 'notes' | 'projects' | 'testSystems'
): Promise<string> => {
	const lastField = await findLastField<T>(field);
	let newRef;
	if (lastField.ref) {
		const lastNumber = +lastField.ref.slice(2);
		newRef = `${RefsEnum[field]}${(lastNumber + 1).toString().padStart(4, '0')}`;
	} else {
		newRef = `${RefsEnum[field]}0001`;
	}
	return newRef;
};

export const updateTags = async <T extends Document & { tags: string[]; ref: string }>(
	project: T,
	newTags: string[],
	{ field, property, model }: { field: string; property: keyof T; model: Model<T> }
): Promise<void> => {
	if (!newTags) return;
	const oldTags = project.tags.map((tag: string) => tag.toString());
	const addToSet = newTags.filter((tag: string) => !oldTags.includes(tag));
	const pull = oldTags.filter((tag: string) => !newTags.includes(tag));
	await addToSetTags(project, { field, property, model }, addToSet);
	await pullTags(project, { field, model }, pull);
};

export const addToSetTags = async <T extends Document & { tags: string[]; ref: string }>(
	project: T,
	{ field, property, model }: { field: string; property: keyof T; model: Model<T> },
	tags?: string[]
): Promise<void> => {
	if (!tags) return;
	await Promise.all(
		tags.map((_id: string) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return updateRepository<any>(
				model,
				{
					_id
				},
				{
					$addToSet: {
						[field]: { _id: project._id, [property]: project[property], ref: project.ref }
					}
				}
			);
		})
	);
};

export const pullTags = async <T extends Document & { tags: string[] }>(
	project: T,
	{ field, model }: { field: string; model: Model<T> },
	tags: string[]
): Promise<void> => {
	console.log(field);
	await Promise.all(
		tags.map((tag) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return updateRepository<any>(
				model,
				{
					_id: tag
				},
				{
					$pull: { [field]: { _id: project._id } }
				}
			);
		})
	);
};

export const encryptPassword = (password: string): string =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(8));
