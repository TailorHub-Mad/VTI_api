import { USER_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import {
	FilterUser,
	GetActiveNote,
	GetFavoritesNotes,
	GetFavoritesProjects,
	GetNoRead,
	getProfile,
	GetSubscribersNotes,
	GetSubscribersProjects,
	Recovery,
	ResetPassword
} from '../controllers/user.controller';
import { Login, SignUp } from '../controllers/auth.controller';
import { DeleteCrud, GetAll, Update } from '../controllers/crud.controller';
import { IUserDocument } from '../interfaces/models.interface';
import { UserModel } from '../models/user.model';
import { updateUserValidation } from '../validations/user.validation';

const router = Router();

router.post('/signup', SignUp);

router.post('/login', Login);

router.get('/me', getProfile);

router.get('/favorite/notes', GetFavoritesNotes);

router.get('/subscribed/notes', GetSubscribersNotes);

router.get('/favorite/projects', GetFavoritesProjects);

router.get('/subscribed/projects', GetSubscribersProjects);

router.get('/active', GetActiveNote);

router.get('/noRead', GetNoRead);

router.put('/:id', Update<IUserDocument>(UserModel, updateUserValidation));

router.delete('/:id', DeleteCrud<IUserDocument>(UserModel));

router.get('/', GetAll<IUserDocument>(UserModel, { path: 'department', select: 'name _id' }));

router.get('/filter', FilterUser);

router.post('/resetPassword', ResetPassword);

router.post('/recovery', Recovery);

export const UserRouter = { router, path: USER_PATH };
