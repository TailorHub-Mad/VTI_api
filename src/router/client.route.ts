import { CLIENTS_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { GetAllAggregate } from '../controllers/crud.controller';

const router = Router();

router.get('/', GetAllAggregate());

export const ClientsRouter = { router, path: CLIENTS_PATH };
