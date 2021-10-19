import { createSet } from '@utils/model.utils';
import { Types } from 'mongoose';
import { NotificationModel } from '../models/notification.model';
import { UserModel } from '../models/user.model';
import { updateRepository } from '../repositories/common.repository';
import {
	INotification,
	INotificationDocument,
	IReqUser,
	IUserDocument
} from '../interfaces/models.interface';
import { ADMIN_NOTIFICATION } from '@constants/notification.constants';
import { mongoIdValidation, notificationValidation } from '../validations/common.validation';

export const createNotification = async (
	reqUser: IReqUser,
	notification: Partial<INotification>
): Promise<INotificationDocument | undefined> => {
	try {
		if (reqUser.role === 'admin') {
			notification.owner = 'Administrador';
		} else {
			const user = await UserModel.findOne({ _id: reqUser.id });
			notification.owner = user?.alias;
		}
		const newNotification = new NotificationModel(notification);
		return await newNotification.save();
	} catch (err) {
		console.error(err);
		logger.error(`Error al crear la notificación ${notification.type}`);
	}
};

export const extendNotification = async (
	model: { field: string; id: string },
	notification?: INotificationDocument,
	forAdmin?: boolean
): Promise<void> => {
	if (!notification) return;
	const query = forAdmin ? { isAdmin: true } : { [`subscribed.${model.field}`]: model.id };
	await UserModel.updateMany(query, {
		$addToSet: { notifications: { status: 'no read', notification: notification._id } }
	});
};

export const getAllNotification = async (
	user: IReqUser,
	query: { type: string[] }
): Promise<{ [key: string]: INotification }> => {
	const filter = Array.isArray(query?.type)
		? query?.type?.reduce((query, type) => {
				query.push({ type });
				return query;
		  }, [] as { type: string }[])
		: query?.type;
	const [{ notifications }] = (await UserModel.aggregate([
		{
			$match: {
				_id: Types.ObjectId(user.id)
			}
		},
		{
			$unwind: {
				path: '$notifications'
			}
		},
		{
			$lookup: {
				from: 'notifications',
				let: {
					notificationId: '$notifications.notification',
					unRead: '$notifications.status',
					pin: '$notifications.pin'
				},
				pipeline: [
					{
						$match: {
							$expr: {
								$eq: ['$_id', '$$notificationId']
							}
						}
					},
					{
						$match: Array.isArray(filter) ? { $or: filter } : filter ? { type: filter } : {}
					},
					{
						$addFields: {
							date: {
								$dateToString: {
									date: '$createdAt',
									format: '%d/%m/%Y'
								}
							},
							unRead: {
								$cond: {
									if: {
										$eq: ['$$unRead', 'no read']
									},
									then: false,
									else: true
								}
							},
							pin: '$$pin'
						}
					},
					{
						$sort: {
							createdAt: -1
						}
					},
					{
						$group: {
							_id: '$date',
							notifications: {
								$push: '$$ROOT'
							}
						}
					}
				],
				as: 'notifications'
			}
		}
	])) || [{}];
	const transformNotifiactions = notifications.reduce(
		(
			transform: { [key: string]: INotification },
			notification: {
				_id: string;
				notifications: INotification;
			}
		) => {
			transform[notification._id] = notification.notifications;
			return transform;
		},
		{} as { [key: string]: INotification }
	);
	return transformNotifiactions;
};

export const updateReadNotification = async (user: IReqUser): Promise<void> => {
	const update = createSet({ status: 'read' }, 'notifications.$[status]');
	console.log(update);
	await updateRepository<IUserDocument>(
		UserModel,
		{
			$and: [{ _id: user.id }, { 'notifications.status': 'no read' }]
		},
		{ 'notification.$.status': 'read' }
	);
};

export const createNotificationAdmin = async (body: { description: string }): Promise<void> => {
	const validBody = await notificationValidation.validateAsync(body);
	const newNotification = new NotificationModel({
		description: validBody.description,
		owner: 'Administrador',
		type: ADMIN_NOTIFICATION
	});
	const notification = await newNotification.save();
	await UserModel.updateMany(
		{},
		{ $addToSet: { notifications: { status: 'no read', notification: notification._id } } }
	);
};

export const updateNotificationPin = async (id: string, user: IReqUser): Promise<void> => {
	const validId = await mongoIdValidation.validateAsync(id);
	const _user = await UserModel.findOne({ _id: user.id });
	if (_user) {
		const indexNotification = _user.notifications.findIndex(
			(notification) => notification.notification.toString() === validId
		);
		_user.notifications[indexNotification].pin = !_user.notifications[indexNotification].pin;
		await _user.save();
	}
};
