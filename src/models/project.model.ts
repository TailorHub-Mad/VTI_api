import { Schema, Types } from 'mongoose';
import { IProjectsDocument, IProjectsModel } from '../interfaces/models.interface';
import { DATE_SCHEMA } from '@constants/model.constants';

export const projectSchema = new Schema<IProjectsDocument, IProjectsModel>(
	{
		alias: { type: String, unique: true, sparse: true, index: true }, // , unique: true, required: true, index: true },
		date: DATE_SCHEMA,
		years: { type: Number },
		sector: { type: Types.ObjectId, ref: 'Sector' },
		focusPoint: [{ type: Types.ObjectId, ref: 'User' }],
		testSystems: [{ type: Types.ObjectId }], // Quizás crear aquí los test system.
		tags: [{ type: Types.ObjectId, ref: 'Tag' }],
		notes: [{ type: Types.ObjectId }],
		closed: DATE_SCHEMA,
		ref: { type: String }
		// users: [{ type: Types.ObjectId, ref: 'User' }]
	},
	{
		timestamps: true,
		versionKey: false
	}
);
