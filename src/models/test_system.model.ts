import { DATE_SCHEMA } from '@constants/model.constants';
import { Schema, Types } from 'mongoose';
import { ITestSystemDocument, ITestSystemModel } from '../interfaces/models.interface';

export const testSystemSchema = new Schema<ITestSystemDocument, ITestSystemModel>(
	{
		vtiCode: { type: String, unque: true, index: true, sparse: true },
		alias: { type: String },
		date: DATE_SCHEMA,
		projects: [{ type: Types.ObjectId }],
		notes: [{ type: Types.ObjectId }]
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

// export const TestSystemModel = model('TestSystem', testSystemSchema);
