import { model, Schema } from 'mongoose';
import { ISectorDocument, ISectorModel } from '../interfaces/models.interface';

const sectorSchema = new Schema<ISectorDocument, ISectorModel>(
	{
		title: { type: String, unique: true, required: true },
		projects: [{ type: String }]
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const SectorModel = model('Sector', sectorSchema);
