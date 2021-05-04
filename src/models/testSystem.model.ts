import { model, Schema, Types } from 'mongoose';
import { ITestSystemDocument, ITestSystemModel } from '../interfaces/models.interface';

const testSystemSchema = new Schema<ITestSystemDocument, ITestSystemModel>(
	{
		vtiCode: { type: String },
		year: { type: Number },
		date: {
			year: { type: String },
			month: { type: String },
			daty: { type: String }
		},
		projects: [{ type: Types.ObjectId, ref: 'Project' }],
		client: { type: Types.ObjectId, ref: 'Client' },
		alias: { type: String },
		notes: [{ type: Types.ObjectId, ref: 'Note' }]
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

export const TestSystemModel = model('TestSystem', testSystemSchema);
