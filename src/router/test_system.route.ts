import { Router } from 'express';
import { TEST_SYSTEM_PATH } from '@constants/routes.constants';
import {
	CreateTestSystem,
	DeleteTestSystem,
	GroupTestSystem,
	UpdateTestSystem
} from '../controllers/test_system.controller';
import {
	GetAllAggregate,
	GetByIdAggregate,
	GetByQueryAggregate
} from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('testSystems', ['projects', 'notes']));

router.get('/group', GroupTestSystem);

router.get('/filter', GetByQueryAggregate('testSystems', ['projects', 'notes']));

router.get('/:id', GetByIdAggregate('testSystems', ['projects', 'notes']));

router.post('/', CreateTestSystem);

router.put('/:id_testSystem', UpdateTestSystem);

router.delete('/:id_testSystem', DeleteTestSystem);

export const TestSystemRouter = { router, path: TEST_SYSTEM_PATH };
