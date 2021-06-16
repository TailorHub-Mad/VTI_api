import { TEST_SYSTEM_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { GetAllAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('testSystem'));

export const TestSystemRouter = { router, path: TEST_SYSTEM_PATH };
