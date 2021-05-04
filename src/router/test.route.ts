import { Router } from 'express';
import { FindModelCarTest, FindModelCarTestCache } from '../controllers/test.controller';

const router = Router();

router.post('/', FindModelCarTest);

router.post('/cache', FindModelCarTestCache);

export const TestRouter = { router, path: '/test' };
