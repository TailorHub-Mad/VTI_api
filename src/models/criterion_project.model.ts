import { Schema, Types } from 'mongoose';
import { ICriterionProjectDocument, ICriterionProjectModel } from '../interfaces/models.interface';
import { CriterionModel } from './criterion.model';

const CriterionProjectSchema = new Schema<ICriterionProjectDocument, ICriterionProjectModel>(
	{
		relatedTags: [{ type: Types.ObjectId, ref: 'TagProject' }]
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const CriterionProjectModel = CriterionModel.discriminator(
	'CriterionProject',
	CriterionProjectSchema,
	'project'
);
