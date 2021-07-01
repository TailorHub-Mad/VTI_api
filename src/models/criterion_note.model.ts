import { Schema, Types } from 'mongoose';
import { ICriterionNoteDocument, ICriterionNoteModel } from '../interfaces/models.interface';
import { CriterionModel } from './criterion.model';

const CriterionNoteSchema = new Schema<ICriterionNoteDocument, ICriterionNoteModel>(
	{
		relatedTags: [{ type: Types.ObjectId, ref: 'TagNote' }]
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

export const CriterionNoteModel = CriterionModel.discriminator(
	'CriterionNote',
	CriterionNoteSchema,
	'note'
);
