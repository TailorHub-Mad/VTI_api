import { DATE_SCHEMA } from '@constants/model.constants';
import { model, Schema, Types } from 'mongoose';
import { ITestSystemDocument, ITestSystemModel } from '../interfaces/models.interface';

const testSystemSchema = new Schema<ITestSystemDocument, ITestSystemModel>(
	{
		vtiCode: { type: String, unique: true, required: true },
		alias: { type: String, unique: true, required: true },
		date: DATE_SCHEMA,
		projects: [{ type: Types.ObjectId, ref: 'Project' }],
		client: { type: Types.ObjectId, ref: 'Client' },
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
