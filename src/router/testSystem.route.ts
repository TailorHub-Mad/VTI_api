import { TEST_SYSTEM_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { GetAllAggregate, GetByIdAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('testSystem'));

router.get('/:id', GetByIdAggregate('testSystem'));

export const TestSystemRouter = { router, path: TEST_SYSTEM_PATH };
