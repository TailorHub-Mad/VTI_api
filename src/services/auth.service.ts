import { UserModel } from '../models/user.model';
import { loginUserValidation, newUserValidation } from '../validations/user.validation';
import { IUser, IUserDocument } from '../interfaces/models.interface';
import { create, read } from './crud.service';
import { signJWT } from './jwt.service';
import { BaseError } from '@errors/base.error';

export const signup = async ({
	email,
	password,
	alias
}: Partial<IUser>): Promise<{ alias: string; token: string }> => {
	const user = await read<IUserDocument>(UserModel, { email }, { limit: 0, offset: 0 });

	if (user[0]) throw new BaseError('Username already exists');
	else {
		const savedUser = await create<IUserDocument>(UserModel, newUserValidation, {
			alias,
			password,
			email
		});
		return { alias: savedUser.alias, token: signJWT(savedUser.id, savedUser.isAdmin) };
	}
};

export const login = async ({
	email,
	password
}: Partial<IUser>): Promise<{ alias: string; token: string }> => {
	await loginUserValidation.validateAsync({ email, password });

	const user = (
		await read<IUserDocument>(UserModel, { email }, { limit: 0, offset: 0 }, '+password')
	)[0];
	if (!user || !user.validatePassword(password as string)) throw new BaseError('Incorrect data');
	return { alias: user.alias, token: signJWT(user.id, user.isAdmin) };
};
