import { DATE_SCHEMA } from '@constants/model.constants';
import { HookNextFunction, model, Schema, Types } from 'mongoose';
import { ITagProjectDocument, ITagProjectModel } from '../interfaces/models.interface';

const tagProjectSchema = new Schema<ITagProjectDocument, ITagProjectModel>(
	{
		name: { type: String, unique: true },
		updated: DATE_SCHEMA,
		relatedTags: [{ type: Types.ObjectId, ref: 'TagProject' }],
		parent: { type: Types.ObjectId, ref: 'TagProject' },
		projects: [{ _id: Types.ObjectId, alias: String, ref: String }],
		ref: { type: String }
	},
	{
		timestamps: true,
		versionKey: false,
		discriminatorKey: 'type',
		toJSON: {
			virtuals: true
		}
	}
);

tagProjectSchema.virtual('isInheritance').get(function (this: ITagProjectDocument) {
	return this.relatedTags.length > 0;
});

tagProjectSchema.pre('save', async function (next: HookNextFunction) {
	try {
		if (this.isNew) {
			const [tag] = await this.db
				.model<ITagProjectDocument>('TagProject')
				.find({})
				.sort({ ref: -1 })
				.collation({
					locale: 'es',
					numericOrdering: true
				})
				.limit(1);
			if (tag?.ref) {
				this.ref = 'TAGPR' + (+tag.ref.slice(5) + 1).toString().padStart(4, '0');
			} else {
				this.ref = 'TAGPR0001';
			}
		}
		next();
	} catch (err) {
		next(err);
	}
});

export const TagProjectModel = model('TagProject', tagProjectSchema);
