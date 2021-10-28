import { Router } from 'express';
import { IFilterDocument } from '../interfaces/models.interface';
import { FilterModel } from '../models/filter.model';
import { createFilterValidation } from '../validations/filter.validation';
import { Create, DeleteCrud, Read } from '../controllers/crud.controller';

const router = Router();

router.get('/simple', Read<IFilterDocument>(FilterModel, { type: 'simple' }));

router.get('/complex', Read<IFilterDocument>(FilterModel, { type: 'complex' }));

router.post('/', Create<IFilterDocument>(FilterModel, createFilterValidation));

router.delete('/delete/:id', DeleteCrud<IFilterDocument>(FilterModel));

export const FilterRouter = { path: '/filter', router };
