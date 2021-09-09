import { Router } from 'express';
import { TEST_SYSTEM_PATH } from '@constants/routes.constants';
import {
	CreateTestSystem,
	DeleteTestSystem,
	GroupTestSystem,
	UpdateTestSystem
} from '../controllers/test_system.controller';
import { GetAllAggregate, GetByIdAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('testSystems', []));

router.get('/group', GroupTestSystem);

router.get('/:id', GetByIdAggregate('testSystems', []));

router.post('/', CreateTestSystem);

router.put('/:id_testSystem', UpdateTestSystem);

router.delete('/:id_testSystem', DeleteTestSystem);

export const TestSystemRouter = { router, path: TEST_SYSTEM_PATH };
