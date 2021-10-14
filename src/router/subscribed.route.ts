import { SUBSCRIBED_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { GetAllSubscribed } from '../controllers/subscribed.controller';

const router = Router();

router.get('/', GetAllSubscribed);

export const SubscribedRouter = { router, path: SUBSCRIBED_PATH };
