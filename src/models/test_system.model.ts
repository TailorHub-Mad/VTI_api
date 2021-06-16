import { DATE_SCHEMA } from '@constants/model.constants';
import { Schema, Types } from 'mongoose';
import { ITestSystemDocument, ITestSystemModel } from '../interfaces/models.interface';
import { noteSchema } from './note.model';

export const testSystemSchema = new Schema<ITestSystemDocument, ITestSystemModel>(
	{
		vtiCode: { type: String, unique: true, required: true, index: true },
		alias: { type: String, unique: true, required: true, index: true },
		date: DATE_SCHEMA,
		projects: [{ type: Types.ObjectId, index: true }],
		notes: [noteSchema]
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
