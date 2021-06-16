import { PROJECTS_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { GetAllAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate('projects'));

export const ProjectsRouter = { router, path: PROJECTS_PATH };
