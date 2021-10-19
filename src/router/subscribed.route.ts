import { SUBSCRIBED_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import {
	GetAllSubscribed,
	GetNotesSubscribed,
	GetProjectsSubscribed,
	GetTestSystemsSubscribed
} from '../controllers/subscribed.controller';

const router = Router();

router.get('/', GetAllSubscribed);

router.get('/project', GetNotesSubscribed);

router.get('/notes', GetProjectsSubscribed);

router.get('/testSystems', GetTestSystemsSubscribed);

export const SubscribedRouter = { router, path: SUBSCRIBED_PATH };
