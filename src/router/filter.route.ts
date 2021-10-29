import { Router } from 'express';
import { IFilterDocument } from '../interfaces/models.interface';
import { FilterModel } from '../models/filter.model';
import { createFilterValidation } from '../validations/filter.validation';
import { Create, DeleteCrud, Update } from '../controllers/crud.controller';
import { GetFilters } from '../controllers/filter.controller';

const router = Router();

router.get('/simple', GetFilters({ type: 'simple' }));

router.get('/complex', GetFilters({ type: 'complex' }));

router.post('/', Create<IFilterDocument>(FilterModel, createFilterValidation));

router.put('/:id', Update<IFilterDocument>(FilterModel, createFilterValidation));

router.delete('/delete/:id', DeleteCrud<IFilterDocument>(FilterModel));

export const FilterRouter = { path: '/filter', router };
