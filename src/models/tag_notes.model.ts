import { DATE_SCHEMA } from '@constants/model.constants';
import { model, Schema, Types } from 'mongoose';
import { ITagNoteDocument, ITagNoteModel } from '../interfaces/models.interface';

const TagNoteSchema = new Schema<ITagNoteDocument, ITagNoteModel>(
	{
		name: { type: String, unique: true },
		updated: DATE_SCHEMA,
		relatedTags: [{ type: Types.ObjectId, ref: 'Tag' }],
		notes: [{ type: Types.ObjectId, ref: 'Notes' }]
	},
	{
		timestamps: true,
		versionKey: false,
		discriminatorKey: 'type'
	}
);

TagNoteSchema.virtual('isInheritance').get(function (this: ITagNoteDocument) {
	return this.relatedTags.length > 0;
});

export const TagNoteModel = model('TagNote', TagNoteSchema);
