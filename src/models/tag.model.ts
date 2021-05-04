import { model, Schema, Types } from 'mongoose';
import { ITagDocument, ITagModel } from '../interfaces/models.interface';

const tagSchema = new Schema<ITagDocument, ITagModel>(
	{
		name: { type: String },
		updated: {
			year: { type: String },
			month: { type: String },
			daty: { type: String }
		},
		projects: [{ type: Types.ObjectId, ref: 'Project' }],
		relatedTags: [{ type: Types.ObjectId, ref: 'Tag' }],
		index: { type: Number }
	},
	{
		timestamps: true,
		versionKey: false,
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

export const TagSchema = model('Tag', tagSchema);
