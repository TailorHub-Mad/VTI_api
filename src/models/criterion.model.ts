import { model, Schema, Types } from 'mongoose';

const CriterionSchema = new Schema(
	{
		name: { type: String, trim: true },
		title: { type: String, trim: true },
		type: { type: String, enum: ['note', 'project'] },
		relatedTags: { type: Types.ObjectId, ref: 'TagNote' }
	},
	{
		timestamps: true,
		versionKey: false,
		discriminatorKey: 'type',
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

CriterionSchema.index({ name: 1, type: 1 }, { unique: true });

export const CriterionModel = model('Criterion', CriterionSchema);
