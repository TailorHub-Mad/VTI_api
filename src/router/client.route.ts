import { CLIENTS_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { ClientModel } from '../models/client.model';
import { Create, GetAllAggregate, Update, ReadById } from '../controllers/crud.controller';
import {
	FilterClientValidation,
	newClientValidation,
	updateClientValidation
} from '../validations/client.validation';
import { IClientDocument } from '../interfaces/models.interface';
import { DeleteClient, FilterClient } from '../controllers/client.controller';

const router = Router();

// Get all clients
router.get('/', GetAllAggregate());

// Filter Client By alias, name and id
router.get('/filter', FilterClient<IClientDocument>(ClientModel, FilterClientValidation));

// Create new Client
router.post('/create', Create<IClientDocument>(ClientModel, newClientValidation));

// Read one client by ID
router.get('/:id', ReadById<IClientDocument>(ClientModel));

// Update one client by ID
router.put('/:id', Update<IClientDocument>(ClientModel, updateClientValidation));

// Delete one client by ID
router.delete('/:id', DeleteClient);

export const ClientsRouter = { router, path: CLIENTS_PATH };
