import { USER_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { getProfile } from '../controllers/user.controller';
import { Login, SignUp } from '../controllers/auth.controller';
import { GetAll } from 'src/controllers/crud.controller';
import { IUserDocument } from 'src/interfaces/models.interface';
import { UserModel } from 'src/models/user.model';

const router = Router();

router.post('/signup', SignUp);

router.post('/login', Login);

router.get('/me', getProfile);

router.get('/all', GetAll<IUserDocument>(UserModel, { path: 'department', select: 'name -_id' }));

export const UserRouter = { router, path: USER_PATH };
