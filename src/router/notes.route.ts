import { NOTES_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { GetAllAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/testSystem', GetAllAggregate('testSystem.notes'));

router.get('/projects', GetAllAggregate('projects.notes'));

export const NotesRouter = { router, path: NOTES_PATH };
