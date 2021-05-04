import { model, Schema, Types } from 'mongoose';
import { INoteDocument, INoteModel } from '../interfaces/models.interface';

const noteSchema = new Schema<INoteDocument, INoteModel>(
	{
		title: { type: String, unique: true, required: true },
		description: { type: String },
		link: { type: String },
		documents: [{ url: { type: String }, name: { type: String } }],
		testSystem: [{ type: Types.ObjectId, ref: 'TestSystem' }],
		projects: [{ type: Types.ObjectId, ref: 'Project' }],
		tags: [{ type: Types.ObjectId, ref: 'Tag' }],
		messages: [{ type: Types.ObjectId, ref: 'Message' }],
		updateLimitDate: { type: Date, default: () => new Date() }, // TODO: crear función generadora de fechas por limite de timepo
		updateTime: { type: Date },
		owner: { type: Types.ObjectId, ref: 'User', required: true },
		readBy: [{ type: Types.ObjectId, ref: 'User' }],
		approved: { type: Boolean, default: false },
		formalized: { type: Boolean, default: false }
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

export const NoteModel = model('Note', noteSchema);
