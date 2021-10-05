import { PROJECTS_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import {
	CreateProject,
	DeleteProject,
	OrderProject,
	UpdateProject
} from '../controllers/project.controller';
import {
	GetAllAggregate,
	GetByIdAggregate,
	GetByQueryAggregate
} from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('projects', ['testSystems', 'notes']));

router.get('/group', OrderProject);

router.get('/filter', GetByQueryAggregate('projects', ['testSystems', 'notes']));

router.post('/', CreateProject);

router.put('/:id_project', UpdateProject);

router.get('/:id', GetByIdAggregate('projects', ['testSystems', 'notes']));

router.delete('/:id_project', DeleteProject);

export const ProjectsRouter = { router, path: PROJECTS_PATH };
