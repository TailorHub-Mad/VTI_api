import { model, Schema, Types } from 'mongoose';
import { INotificationDocument, INotificationModel } from '../interfaces/models.interface';

const notificationSchema = new Schema<INotificationDocument, INotificationModel>(
	{
		description: { type: String, required: true, trim: true },
		owner: { type: String },
		urls: [
			{
				label: { type: String },
				model: { type: String, enum: ['projects', 'testSytems', 'notes'] },
				id: { type: Types.ObjectId }
			}
		],
		deleteTime: { type: Boolean },
		type: { type: String, required: true },
		pin: { type: Boolean, default: false }
	},
	{
		timestamps: true,
		versionKey: false
	}
);

export const NotificationModel = model('Notification', notificationSchema);