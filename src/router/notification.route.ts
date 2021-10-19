import { NOTIFICATION_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { GetAllNotification } from '../controllers/notification.controller';

const router = Router();

router.get('/', GetAllNotification);

export const NotificationRouter = { router, path: NOTIFICATION_PATH };
