import { model, Schema } from 'mongoose';

const CriterionSchema = new Schema(
	{
		title: { type: String, trim: true },
		type: { type: String, enum: ['note', 'project'] },
		order: { type: Number }
	},
	{
		timestamps: true,
		versionKey: false,
		discriminatorKey: 'type'
	}
);

CriterionSchema.index({ title: 1, type: 1 }, { unique: true });

export const CriterionModel = model('Criterion', CriterionSchema);
