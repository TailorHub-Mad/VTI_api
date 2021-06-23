import { PROJECTS_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { GetAllAggregate, GetByIdAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('projects'));

router.get('/:id', GetByIdAggregate('projects'));

export const ProjectsRouter = { router, path: PROJECTS_PATH };
