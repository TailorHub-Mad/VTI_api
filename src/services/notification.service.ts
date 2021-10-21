import { Types } from 'mongoose';
import { NotificationModel } from '../models/notification.model';
import { UserModel } from '../models/user.model';
import { INotification, INotificationDocument, IReqUser } from '../interfaces/models.interface';
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
	const query = forAdmin
		? { isAdmin: true }
		: { $or: [{ [`subscribed.${model.field}`]: model.id }, { isAdmin: true }] };
	await UserModel.updateMany(query, {
		$addToSet: { notifications: { status: 'no read', notification: notification._id } }
	});
};

export const getAllNotification = async (
	user: IReqUser,
	query: { type: string[]; pin: string }
): Promise<{ [key: string]: INotification }> => {
	let filter: unknown[] = Array.isArray(query?.type)
		? query?.type?.reduce((query, type) => {
				query.push({ type });
				return query;
		  }, [] as { type: string }[])
		: query?.type;
	if (query.pin === 'true') {
		if (filter) {
			filter.push({ $expr: { $eq: ['$$pin', true] } });
		} else {
			filter = [{ $expr: { $eq: ['$$pin', true] } }];
		}
	}
	const [notifications] =
		(await UserModel.aggregate([
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
							$match: {
								$expr: {
									$not: {
										$eq: ['$$unRead', 'disabled']
									}
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
			},
			{
				$group: {
					_id: '$_id',
					notifications: {
						$push: {
							$arrayElemAt: ['$notifications', 0]
						}
					}
				}
			}
		])) || {};

	const transformNotifiactions = notifications?.notifications.reverse().reduce(
		(
			transform: { [key: string]: INotification[] },
			notification: {
				_id: string;
				notifications: INotification[];
			}
		) => {
			if (transform[notification._id]) {
				transform[notification._id].push(notification.notifications[0]);
			} else {
				transform[notification._id] = notification.notifications;
			}
			return transform;
		},
		{} as { [key: string]: INotification[] }
	);
	return transformNotifiactions;
};

export const updateReadNotification = async (user: IReqUser): Promise<void> => {
	const userFind = await UserModel.findOne({ _id: user.id });
	if (userFind) {
		userFind.notifications = userFind.notifications.map((notification) => {
			if (notification.status === 'no read') {
				notification.status = 'read';
			}
			return notification;
		});
		await userFind.save();
	}
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
