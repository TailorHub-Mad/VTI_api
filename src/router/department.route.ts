import { Router } from 'express';
import { Create, DeleteCrud, GetAll, ReadById, Update } from '../controllers/crud.controller';
import { IDepartmentDocument } from '../interfaces/models.interface';
import { DepartmentModel } from '../models/department.model';
import {
	createDepartmentValidation,
	updateDepartmentValidation
} from '../validations/department.validations';

const router = Router();

router.get(
	'/all',
	GetAll<IDepartmentDocument>(DepartmentModel, { path: 'users', select: 'alias -_id' })
);

router.get(
	'/:id',
	ReadById<IDepartmentDocument>(DepartmentModel, { path: 'users', select: 'alias' })
);

router.post('/create', Create<IDepartmentDocument>(DepartmentModel, createDepartmentValidation));

router.put('/update/:id', Update<IDepartmentDocument>(DepartmentModel, updateDepartmentValidation));

router.delete('/delete/:id', DeleteCrud<IDepartmentDocument>(DepartmentModel));

export const DepartmentRouter = { router, path: '/department' };
