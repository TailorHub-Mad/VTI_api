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
		discriminatorKey: 'type',
		toJSON: {
			transform: function (doc, ret) {
				ret.id = doc._id;
				delete ret._id;
			}
		},
		toObject: {
			transform: function (doc, ret) {
				ret.id = doc._id;
				delete ret._id;
			}
		}
	}
);

export const TagNoteModel = model('TagNote', TagNoteSchema);
