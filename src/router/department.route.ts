import { Router } from 'express';
import { FilterClient } from '../controllers/client.controller';
import { Create, DeleteCrud, GetAll, ReadById, Update } from '../controllers/crud.controller';
import { IDepartmentDocument } from '../interfaces/models.interface';
import { DepartmentModel } from '../models/department.model';
import {
	createDepartmentValidation,
	filterDepartmentvalidation,
	updateDepartmentValidation
} from '../validations/department.validations';

const router = Router();

router.get('/', GetAll<IDepartmentDocument>(DepartmentModel, { path: 'users' }));

router.get(
	'/filter',
	FilterClient<IDepartmentDocument>(DepartmentModel, filterDepartmentvalidation, {
		path: 'users'
	})
);

router.get(
	'/:id',
	ReadById<IDepartmentDocument>(DepartmentModel, {
		path: 'users',
		populate: { path: 'department' },
		select: 'alias name lastName email'
	})
);

router.post('/create', Create<IDepartmentDocument>(DepartmentModel, createDepartmentValidation));

router.put('/update/:id', Update<IDepartmentDocument>(DepartmentModel, updateDepartmentValidation));

router.delete('/delete/:id', DeleteCrud<IDepartmentDocument>(DepartmentModel));

export const DepartmentRouter = { router, path: '/department' };
