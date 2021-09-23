import { CLIENTS_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { ClientModel } from '../models/client.model';
import {
	Create,
	GetAllAggregate,
	Update,
	ReadById,
	DeleteCrud
} from '../controllers/crud.controller';
import { newClientValidation, updateClientValidation } from '../validations/client.validation';
import { IClientDocument } from '../interfaces/models.interface';
import { FilterClient } from '../controllers/client.controller';

const router = Router();

// Get all clients
router.get('/', GetAllAggregate());

// Filter Client By alias, name and id
router.get('/filter', FilterClient);

// Create new Client
router.post('/create', Create<IClientDocument>(ClientModel, newClientValidation));

// Read one client by ID
router.get('/:id', ReadById<IClientDocument>(ClientModel));

// Update one client by ID
router.put('/:id', Update<IClientDocument>(ClientModel, updateClientValidation));

// Delete one client by ID
router.delete('/:id', DeleteCrud<IClientDocument>(ClientModel));

export const ClientsRouter = { router, path: CLIENTS_PATH };
