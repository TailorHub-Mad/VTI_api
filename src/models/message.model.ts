import { model, Schema, Types } from 'mongoose';
import { IMessageDocument, IMessageModel } from '../interfaces/models.interface';

export const messageSchema = new Schema<IMessageDocument, IMessageModel>(
	{
		owner: { type: Types.ObjectId, ref: 'User' },
		approved: { type: Boolean, default: false },
		formalized: { type: Boolean, default: false },
		message: { type: String },
		createdAt: { type: Date },
		updatedAt: { type: Date }
	},
	{
		timestamps: true,
		versionKey: false,
		toJSON: {
			transform: (doc, ret) => {
				ret.id = doc._id;

				delete ret._id;
			}
		},
		toObject: {
			transform: (doc, ret) => {
				ret.id = doc._id;

				delete ret._id;
			}
		}
	}
);

export const MessageModel = model('Message', messageSchema);
