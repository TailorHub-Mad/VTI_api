import { model, Schema, Types } from 'mongoose';
import { IVtiCodeDocument, IVtiCodeModel } from '../interfaces/models.interface';

const vtiCodeSchema = new Schema<IVtiCodeDocument, IVtiCodeModel>(
	{
		name: { type: String, unique: true },
		testSystems: [{ type: Types.ObjectId, ref: 'client' }]
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const VtiCodeModel = model('VtiCode', vtiCodeSchema);
