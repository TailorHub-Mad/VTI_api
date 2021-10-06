import { HookNextFunction, Schema, Types } from 'mongoose';
import { ICriterionProjectDocument, ICriterionProjectModel } from '../interfaces/models.interface';
import { CriterionModel } from './criterion.model';

const CriterionProjectSchema = new Schema<ICriterionProjectDocument, ICriterionProjectModel>(
	{
		title: { type: String, trim: true, unique: true },
		group: [
			{
				name: { type: String, trim: true, unique: true },
				relatedTags: [{ type: Types.ObjectId, ref: 'TagProject' }]
			}
		]
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
			if ((criterion as unknown as { order: number }).order) {
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
