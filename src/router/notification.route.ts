import { NOTIFICATION_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import {
	CreateNotification,
	DeleteNotification,
	GetAllNotification,
	UpdatePin
} from '../controllers/notification.controller';

const router = Router();

router.get('/', GetAllNotification);

router.post('/create', CreateNotification);

router.get('/pin/:id', UpdatePin);

router.delete('/:id', DeleteNotification);

export const NotificationRouter = { router, path: NOTIFICATION_PATH };
