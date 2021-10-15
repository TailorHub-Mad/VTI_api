import { HookNextFunction, Schema, Types } from 'mongoose';
import { ICriterionNoteDocument, ICriterionNoteModel } from '../interfaces/models.interface';
import { CriterionModel } from './criterion.model';

const groupSchema = new Schema(
	{
		name: { type: String, trim: true, unique: true },
		relatedTags: [{ type: Types.ObjectId, ref: 'TagNote' }]
	},
	{
		timestamps: true,
		versionKey: false
	}
);

const CriterionNoteSchema = new Schema<ICriterionNoteDocument, ICriterionNoteModel>(
	{
		title: { type: String, trim: true, unique: true },
		group: [groupSchema]
	},
	{
		timestamps: true,
		versionKey: false
	}
);

CriterionNoteSchema.pre('save', async function (next: HookNextFunction) {
	try {
		if (this.isNew) {
			const [criterion] = await this.db
				.model<ICriterionNoteDocument>('CriterionNote')
				.find({ type: 'note' })
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

export const CriterionNoteModel = CriterionModel.discriminator(
	'CriterionNote',
	CriterionNoteSchema,
	'note'
);
