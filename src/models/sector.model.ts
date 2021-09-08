import { model, Schema } from 'mongoose';
import { ISectorDocument, ISectorModel } from '../interfaces/models.interface';

const sectorSchema = new Schema<ISectorDocument, ISectorModel>(
	{
		title: { type: String, unique: true, required: true },
		projects: [{ type: String }]
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

export const SectorModel = model('Sector', sectorSchema);
