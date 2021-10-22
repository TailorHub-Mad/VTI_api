import express from 'express';
import { FilterClient } from '../controllers/client.controller';
import { Create, DeleteCrud, GetAll, Update } from '../controllers/crud.controller';
import { IVtiCodeDocument } from '../interfaces/models.interface';
import { VtiCodeModel } from '../models/vti_code.model';
import {
	createVtiCodeValidation,
	filterVtiCodeValidation
} from '../validations/vti_code.validation';
const router = express.Router();

router.post('/create', Create<IVtiCodeDocument>(VtiCodeModel, createVtiCodeValidation));

router.get('/', GetAll<IVtiCodeDocument>(VtiCodeModel));

router.get('/filter', FilterClient<IVtiCodeDocument>(VtiCodeModel, filterVtiCodeValidation));

router.put('/update/:id', Update<IVtiCodeDocument>(VtiCodeModel, createVtiCodeValidation));

router.delete('/delete/:id', DeleteCrud<IVtiCodeDocument>(VtiCodeModel));

export const VtiCodeRoute = { path: '/vtiCode', router };
