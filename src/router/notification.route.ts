import { NOTIFICATION_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import {
	CreateNotification,
	GetAllNotification,
	UpdatePin
} from '../controllers/notification.controller';

const router = Router();

router.get('/', GetAllNotification);

router.post('/create', CreateNotification);

router.get('/pin/:id', UpdatePin);

export const NotificationRouter = { router, path: NOTIFICATION_PATH };
