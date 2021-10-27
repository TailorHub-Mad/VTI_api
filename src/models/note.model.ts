import { Schema, Types } from 'mongoose';
import { INoteDocument, INoteModel } from '../interfaces/models.interface';
import { messageSchema } from './message.model';

export const noteSchema = new Schema<INoteDocument, INoteModel>(
	{
		title: { type: String, unique: true, index: true, sparse: true }, //, unique: true, required: true },
		description: { type: String },
		link: { type: String },
		documents: [{ url: { type: String }, name: { type: String } }],
		tags: [{ type: Types.ObjectId, ref: 'Tag' }],
		messages: [messageSchema],
		updateLimitDate: {
			type: Date,
			default: () => {
				const date = new Date();
				date.setHours(date.getHours() + 1);
				return date;
			}
		}, // TODO: crear función generadora de fechas por limite de timepo
		updateTime: { type: Date, default: () => new Date() },
		owner: { type: Types.ObjectId, ref: 'User' }, // ad required: true
		readBy: [{ type: Types.ObjectId, ref: 'User' }], // eliminar cuando se crean nuemos mensajes.
		isClosed: { type: Boolean, default: false },
		formalized: { type: Boolean, default: false },
		ref: { type: String }
	},
	{
		timestamps: true,
		versionKey: false
	}
);

// export const NoteModel = model('Note', noteSchema);
