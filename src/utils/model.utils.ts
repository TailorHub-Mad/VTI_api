import { Document, Model, Types } from 'mongoose';
import { ITagProjectDocument } from '../interfaces/models.interface';
import { TagProjectModel } from '../models/tag_project.model';
import { updateRepository } from '../repositories/common.repository';
import { RefsEnum } from '../enums/client.enum';
import { findLastField } from '../repositories/client.repository';

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

export const updateTags = async <T extends Document & { tags: string[] }>(
	project: T,
	newTags: string[],
	{ field, property, model }: { field: string; property: keyof T; model: Model<T> }
): Promise<void> => {
	if (!newTags) return;
	const oldTags = project.tags.map((tag: string) => tag.toString());
	const addToSet = newTags.filter((tag: string) => !(oldTags as string[]).includes(tag));
	const pull = oldTags.filter((tag: string) => !newTags.includes(tag));

	await addToSetTags(project, { field, property, model }, addToSet);
	await pullTags(project, pull);
};

export const addToSetTags = async <T extends Document & { tags: string[] }>(
	project: T,
	{ field, property, model }: { field: string; property: keyof T; model: Model<T> },
	tags?: string[]
): Promise<void> => {
	console.log(tags);
	console.log({ $addToSet: { [field]: { _id: project._id, [property]: project[property] } } });
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
					$addToSet: { [field]: { _id: project._id, [property]: project[property] } }
				}
			);
		})
	);
};

export const pullTags = async <T extends Document & { tags: string[] }>(
	project: T,
	tags: string[]
): Promise<void> => {
	await Promise.all(
		tags.map((tag) => {
			return updateRepository<ITagProjectDocument>(
				TagProjectModel,
				{
					_id: tag
				},
				{
					$pull: { projects: { _id: project._id } }
				}
			);
		})
	);
};
