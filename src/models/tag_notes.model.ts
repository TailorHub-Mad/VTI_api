import { DATE_SCHEMA } from '@constants/model.constants';
import { HookNextFunction, model, Schema, Types } from 'mongoose';
import { ITagNoteDocument, ITagNoteModel } from '../interfaces/models.interface';

const TagNoteSchema = new Schema<ITagNoteDocument, ITagNoteModel>(
	{
		name: { type: String, unique: true },
		updated: DATE_SCHEMA,
		relatedTags: [{ type: Types.ObjectId, ref: 'TagNote' }],
		parent: { type: Types.ObjectId, ref: 'TagNote' },
		notes: [{ _id: Types.ObjectId, title: String, ref: String }],
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

TagNoteSchema.virtual('isInheritance').get(function (this: ITagNoteDocument) {
	return this.relatedTags.length > 0;
});

TagNoteSchema.pre('save', async function (next: HookNextFunction) {
	try {
		if (this.isNew) {
			const [tag] = await this.db
				.model<ITagNoteDocument>('TagNote')
				.find({})
				.sort({ ref: -1 })
				.collation({
					locale: 'es',
					numericOrdering: true
				})
				.limit(1);
			if (tag?.ref) {
				this.ref = 'TAGAP' + (+tag.ref.slice(5) + 1).toString().padStart(4, '0');
			} else {
				this.ref = 'TAGAP0001';
			}
		}
		next();
	} catch (err) {
		next(err);
	}
});

export const TagNoteModel = model('TagNote', TagNoteSchema);
