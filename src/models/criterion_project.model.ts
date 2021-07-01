import { Schema, Types } from 'mongoose';
import { ICriterionProjectDocument, ICriterionProjectModel } from '../interfaces/models.interface';
import { CriterionModel } from './criterion.model';

const CriterionProjectSchema = new Schema<ICriterionProjectDocument, ICriterionProjectModel>(
	{
		relatedTags: [{ type: Types.ObjectId, ref: 'TagProjectNote' }]
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

export const CriterionProjectModel = CriterionModel.discriminator(
	'CriterionProject',
	CriterionProjectSchema,
	'project'
);
