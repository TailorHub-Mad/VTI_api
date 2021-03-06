import { HookNextFunction, Schema, Types } from 'mongoose';
import { ICriterionProjectDocument, ICriterionProjectModel } from '../interfaces/models.interface';
import { CriterionModel } from './criterion.model';

const groupSchema = new Schema(
	{
		name: { type: String, trim: true },
		relatedTags: [{ type: Types.ObjectId, ref: 'TagProject' }]
	},
	{
		timestamps: true,
		versionKey: false
	}
);

const CriterionProjectSchema = new Schema<ICriterionProjectDocument, ICriterionProjectModel>(
	{
		title: { type: String, trim: true, unique: true },
		group: [groupSchema]
	},
	{
		timestamps: true,
		versionKey: false
	}
);

CriterionProjectSchema.pre('save', async function (next: HookNextFunction) {
	try {
		if (this.isNew) {
			const [criterion] = await this.db
				.model<ICriterionProjectDocument>('CriterionProject')
				.find({ type: 'project' })
				.sort({ order: -1 })
				.limit(1);
			if ((criterion as unknown as { order: number })?.order >= 0) {
				this.order = criterion.order + 1;
			} else {
				this.order = 0;
			}
		}
		next();
	} catch (err) {
		next(err);
	}
});

export const CriterionProjectModel = CriterionModel.discriminator(
	'CriterionProject',
	CriterionProjectSchema,
	'project'
);
