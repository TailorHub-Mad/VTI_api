import { DATE_SCHEMA } from '@constants/model.constants';
import { model, Schema, Types } from 'mongoose';
import { ITagDocument, ITagModel } from '../interfaces/models.interface';

const tagSchema = new Schema<ITagDocument, ITagModel>(
	{
		name: { type: String, unique: true },
		updated: DATE_SCHEMA,
		relatedTags: [{ type: Types.ObjectId, ref: 'Tag' }],
		type: { type: String, enum: ['project', 'note'], required: true }
		// projects: [{ type: Types.ObjectId, ref: 'Project' }],
	},
	{
		timestamps: true,
		versionKey: false,
		discriminatorKey: 'type'
	}
);

export const TagModel = model('Tag', tagSchema);
