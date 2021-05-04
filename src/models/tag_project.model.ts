import { Schema, Types } from 'mongoose';
import { TagModel } from './tag.model';

const tagProjectSchema = new Schema(
	{
		projects: [{ type: Types.ObjectId, ref: 'Projects' }]
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

export const TagProjectModel = TagModel.discriminator('TagProject', tagProjectSchema, 'project');
