import { DATE_SCHEMA } from '@constants/model.constants';
import { model, Schema, Types } from 'mongoose';
import { ITagNoteDocument, ITagNoteModel } from '../interfaces/models.interface';

const TagNoteSchema = new Schema<ITagNoteDocument, ITagNoteModel>(
	{
		name: { type: String, unique: true },
		updated: DATE_SCHEMA,
		relatedTags: [{ type: Types.ObjectId, ref: 'TagNote' }],
		parent: { type: Types.ObjectId, ref: 'TagNote' },
		notes: [{ _id: Types.ObjectId, title: String }]
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

export const TagNoteModel = model('TagNote', TagNoteSchema);
