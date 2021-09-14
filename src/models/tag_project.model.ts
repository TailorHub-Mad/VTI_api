import { DATE_SCHEMA } from '@constants/model.constants';
import { model, Schema, Types } from 'mongoose';
import { ITagProjectDocument, ITagProjectModel } from '../interfaces/models.interface';

const tagProjectSchema = new Schema<ITagProjectDocument, ITagProjectModel>(
	{
		name: { type: String, unique: true },
		updated: DATE_SCHEMA,
		relatedTags: [{ type: Types.ObjectId, ref: 'Tag' }],
		projects: [{ type: Types.ObjectId, ref: 'Project' }]
	},
	{
		timestamps: true,
		versionKey: false,
		discriminatorKey: 'type'
	}
);

tagProjectSchema.virtual('isInheritance').get(function (this: ITagProjectDocument) {
	return this.relatedTags.length > 0;
});

export const TagProjectModel = model('TagProject', tagProjectSchema);
