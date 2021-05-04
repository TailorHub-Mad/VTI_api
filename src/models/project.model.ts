import { model, Schema, Types } from 'mongoose';
import { IProjectsDocument, IProjectsModel } from '../interfaces/models.interface';

const projectSchema = new Schema<IProjectsDocument, IProjectsModel>(
	{
		alias: { type: String },
		date: {
			year: { type: String },
			month: { type: String },
			daty: { type: String }
		},
		years: { type: Number },
		client: { type: Types.ObjectId, ref: 'Client' },
		sector: { type: Types.ObjectId, ref: 'Sector' },
		focusPoint: [{ type: Types.ObjectId, ref: 'User' }],
		testSystem: [{ type: Types.ObjectId, ref: 'TestSystem' }],
		tag: [{ type: Types.ObjectId, ref: 'Tag' }],
		notes: [{ type: Types.ObjectId, ref: 'Note' }],
		closed: { type: Date },
		users: [{ type: Types.ObjectId, ref: 'User' }]
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

export const ProjectModel = model('Project', projectSchema);
