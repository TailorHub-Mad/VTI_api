import { PROJECTS_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { CreateProject, UpdateProject } from '../controllers/project.controller';
import { GetAllAggregate, GetByIdAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('projects'));

router.get('/:id', GetByIdAggregate('projects'));

router.post('/', CreateProject);

router.put('/:id_project', UpdateProject);

export const ProjectsRouter = { router, path: PROJECTS_PATH };
