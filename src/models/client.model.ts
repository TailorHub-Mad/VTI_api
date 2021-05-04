import { model, Schema, Types } from 'mongoose';
import { IClientDocument, IClientModel } from '../interfaces/models.interface';

const clientSchema = new Schema<IClientDocument, IClientModel>(
	{
		alias: { type: String },
		name: { type: String },
		link: { type: String },
		testSystem: [{ type: Types.ObjectId, ref: 'TestSystem' }],
		projects: [{ type: Types.ObjectId, ref: 'Project' }]
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

export const ClientModel = model('Client', clientSchema);
