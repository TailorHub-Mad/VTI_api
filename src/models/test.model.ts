import { Schema, model, Types } from 'mongoose';

const schemaTest = new Schema(
	{
		name: { type: String },
		age: { type: String },
		car: { type: Types.ObjectId, ref: 'brand' }
	},
	{
		timestamps: true
	}
);

export const TestModel = model('test', schemaTest);
