import { Schema, Types } from 'mongoose';
import { TagModel } from './tag.model';

const TagNoteSchema = new Schema(
	{
		notes: [{ type: Types.ObjectId, ref: 'Notes' }]
		// projects: [{ type: Types.ObjectId, ref: 'Projects' }]
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: {
			transform: function (doc, ret) {
				ret.id = doc._id;
				delete ret._id;
			}
		}
	}
);

export const TagNoteModel = TagModel.discriminator('TagNote', TagNoteSchema, 'note');
