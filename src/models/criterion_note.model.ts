import { Schema, Types } from 'mongoose';
import { ICriterionNoteDocument, ICriterionNoteModel } from '../interfaces/models.interface';
import { CriterionModel } from './criterion.model';

const CriterionNoteSchema = new Schema<ICriterionNoteDocument, ICriterionNoteModel>(
	{
		relatedTags: [{ type: Types.ObjectId, ref: 'TagNote' }]
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const CriterionNoteModel = CriterionModel.discriminator(
	'CriterionNote',
	CriterionNoteSchema,
	'note'
);
