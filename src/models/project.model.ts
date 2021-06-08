import { DATE_SCHEMA } from '@constants/model.constants';
import { model, Schema, Types } from 'mongoose';
import { IProjectsDocument, IProjectsModel } from '../interfaces/models.interface';

export const projectSchema = new Schema<IProjectsDocument, IProjectsModel>(
	{
		alias: { type: String, unique: true, required: true },
		date: DATE_SCHEMA,
		years: { type: Number },
		sector: { type: Types.ObjectId, ref: 'Sector' },
		focusPoint: [{ type: Types.ObjectId, ref: 'User' }],
		testSystems: [{ type: Types.ObjectId }], // Quizás crear aquí los test system.
		tag: [{ type: Types.ObjectId, ref: 'Tag' }],
		notes: [{ type: Types.ObjectId, ref: 'Note' }],
		closed: { type: Date }
		// users: [{ type: Types.ObjectId, ref: 'User' }]
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
