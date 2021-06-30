import { TEST_SYSTEM_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { CreateTestSystem, UpdateTestSystem } from '../controllers/test_system.controller';
import { GetAllAggregate, GetByIdAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('testSystem'));

router.get('/:id', GetByIdAggregate('testSystem'));

router.post('/', CreateTestSystem);

router.put('/:id_testSystem', UpdateTestSystem);

export const TestSystemRouter = { router, path: TEST_SYSTEM_PATH };
