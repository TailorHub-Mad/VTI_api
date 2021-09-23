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

router.get('/', GetAllAggregate('projects', ['testSystems']));

router.get('/group', OrderProject);

router.get('/filter', GetByQueryAggregate('projects'));

router.post('/', CreateProject);

router.put('/:id_project', UpdateProject);

router.get('/:id', GetByIdAggregate('projects', ['testSystems']));

router.delete('/:id_project', DeleteProject);

export const ProjectsRouter = { router, path: PROJECTS_PATH };
