import { USER_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import {
	GetFavorites,
	GetNoRead,
	getProfile,
	GetSubscribers,
	Recovery,
	ResetPassword
} from '../controllers/user.controller';
import { Login, SignUp } from '../controllers/auth.controller';
import { DeleteCrud, GetAll, Update } from '../controllers/crud.controller';
import { IUserDocument } from '../interfaces/models.interface';
import { UserModel } from '../models/user.model';
import { filterUserValidation, updateUserValidation } from '../validations/user.validation';
import { FilterClient } from '../controllers/client.controller';

const router = Router();

router.post('/signup', SignUp);

router.post('/login', Login);

router.get('/me', getProfile);

router.get('/favorite', GetFavorites);

router.get('/subscribed', GetSubscribers);

router.get('/noRead', GetNoRead);

router.put('/:id', Update<IUserDocument>(UserModel, updateUserValidation));

router.delete('/:id', DeleteCrud<IUserDocument>(UserModel));

router.get('/', GetAll<IUserDocument>(UserModel, { path: 'department', select: 'name -_id' }));

router.get(
	'/filter',
	FilterClient<IUserDocument>(UserModel, filterUserValidation, {
		path: 'department',
		select: 'name -_id'
	})
);

router.post('/resetPassword', ResetPassword);

router.post('/recovery', Recovery);

export const UserRouter = { router, path: USER_PATH };
