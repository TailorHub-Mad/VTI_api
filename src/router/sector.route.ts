import { Router } from 'express';
import { FilterClient } from '../controllers/client.controller';
import { Create, DeleteCrud, GetAll, ReadById, Update } from '../controllers/crud.controller';
import { ISectorDocument } from '../interfaces/models.interface';
import { SectorModel } from '../models/sector.model';
import {
	createSectorValidation,
	filterSectorValidation,
	updateSectorValidation
} from '../validations/sector.validation';

const router = Router();

router.get('/', GetAll<ISectorDocument>(SectorModel));

router.get('/filter', FilterClient<ISectorDocument>(SectorModel, filterSectorValidation));

router.get('/:id', ReadById<ISectorDocument>(SectorModel));

router.post('/create', Create<ISectorDocument>(SectorModel, createSectorValidation));

router.put('/update/:id', Update<ISectorDocument>(SectorModel, updateSectorValidation));

router.delete('/delete/:id', DeleteCrud<ISectorDocument>(SectorModel));

export const SectorRouter = { router, path: '/sector' };
