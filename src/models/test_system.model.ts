import { DATE_SCHEMA } from '@constants/model.constants';
import { Schema, Types } from 'mongoose';
import { ITestSystemDocument, ITestSystemModel } from '../interfaces/models.interface';

export const testSystemSchema = new Schema<ITestSystemDocument, ITestSystemModel>(
	{
		vtiCode: { type: Types.ObjectId },
		alias: { type: String },
		date: DATE_SCHEMA,
		projects: [{ type: Types.ObjectId }],
		notes: [{ type: Types.ObjectId }],
		ref: { type: String }
	},
	{
		timestamps: true,
		versionKey: false
	}
);

// export const TestSystemModel = model('TestSystem', testSystemSchema);
