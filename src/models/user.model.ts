import { model, Schema, Types } from 'mongoose';
import { IUserDocument, IUserModel, NOTIFICATION_STATUS } from '../interfaces/models.interface';

const userSchema = new Schema<IUserDocument, IUserModel>(
	{
		email: { type: String },
		alias: { type: String },
		name: { type: String },
		lastName: { type: String },
		isAdmin: { type: Boolean },
		department: { type: Types.ObjectId, ref: '' },
		projectsComments: [{ type: Types.ObjectId, ref: '' }],
		focusPoint: [{ type: Types.ObjectId, ref: '' }],
		favorites: {
			notes: [{ type: Types.ObjectId, ref: '' }],
			projects: [{ type: Types.ObjectId, ref: '' }]
		},
		subscribed: {
			notes: [{ type: Types.ObjectId, ref: '' }],
			projects: [{ type: Types.ObjectId, ref: '' }],
			testSystems: [{ type: Types.ObjectId, ref: '' }]
		},
		notifications: {
			status: { type: String, enum: NOTIFICATION_STATUS, default: NOTIFICATION_STATUS[0] },
			notification: { type: Types.ObjectId, ref: '' }
		}
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

export const UserModel = model('User', userSchema);
