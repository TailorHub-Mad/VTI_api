import { Schema, model } from 'mongoose';
import { IFilterDocument, IFilterModel } from '../interfaces/models.interface';

const filterSchema = new Schema<IFilterDocument, IFilterModel>(
	{
		name: { type: String, trim: true, unique: true, required: true },
		type: { type: String, enum: ['simple', 'complex'] },
		query: { type: String, trim: true }
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const FilterModel = model('Filtre', filterSchema);
