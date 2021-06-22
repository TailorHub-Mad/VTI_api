import { CLIENTS_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { ClientModel } from '../models/client.model';
import { Create, GetAllAggregate } from '../controllers/crud.controller';
import { newClientValidation } from '../validations/client.validation';

const router = Router();

router.get('/', GetAllAggregate());

router.post('/create', Create(ClientModel, newClientValidation));

export const ClientsRouter = { router, path: CLIENTS_PATH };
