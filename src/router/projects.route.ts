import { PROJECTS_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { CreateProject, UpdateProject } from '../controllers/project.controller';
import { GetAllAggregate, GetByIdAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('projects'));

// router.get('/help')

router.post('/', CreateProject);

router.put('/:id_project', UpdateProject);

router.get('/:id', GetByIdAggregate('projects'));

export const ProjectsRouter = { router, path: PROJECTS_PATH };
