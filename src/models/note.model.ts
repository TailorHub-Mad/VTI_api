import { model, Schema, Types } from 'mongoose';
import { INoteDocument, INoteModel } from '../interfaces/models.interface';

const noteSchema = new Schema<INoteDocument, INoteModel>(
	{
		title: { type: String },
		description: { type: String },
		link: { type: String },
		documents: [{ url: { type: String }, name: { type: String } }],
		// type: enum; // qué tipos
		testSystem: [{ type: Types.ObjectId, ref: 'TestSystem' }],
		projects: [{ type: Types.ObjectId, ref: 'Project' }],
		tags: [{ type: Types.ObjectId, ref: 'Tag' }],
		messages: [{ type: Types.ObjectId, ref: 'Message' }],
		// update: IDate; // da error con el Document de mongoose
		// updateTime: IDate, // more info con update
		owner: { type: Types.ObjectId, ref: 'User' },
		read: [{ type: Types.ObjectId, ref: 'User' }],
		aproved: { type: Boolean },
		formalize: { type: Boolean }
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
