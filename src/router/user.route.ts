import { USER_PATH } from '@constants/routes.constants';
import { Router } from 'express';
import { getProfile } from '../controllers/user.controller';
import { Login, SignUp } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', SignUp);

router.post('/login', Login);

router.get('/me', getProfile);

export const UserRouter = { router, path: USER_PATH };
