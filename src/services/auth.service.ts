/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { UserModel } from '../models/user.model';
import { loginUserValidation, newUserValidation } from '../validations/user.validation';
import { IDepartmentDocument, IUser, IUserDocument } from '../interfaces/models.interface';
import { create, read } from './crud.service';
import { signJWT } from './jwt.service';
import { BaseError } from '@errors/base.error';
import { updateRepository } from '../repositories/common.repository';
import { DepartmentModel } from '../models/department.model';
import { randomBytes } from 'crypto';

export const signup = async ({
	email,
	password,
	alias,
	department,
	lastName,
	name
}: Partial<IUser>): Promise<{ alias: string; token: string; role: string }> => {
	const user = await read<IUserDocument>(UserModel, { email }, { limit: 0, offset: 0 });

	if (user[0]) throw new BaseError('Username already exists', 400);
	else {
		if (!password) {
			password = 'vti-password-1234';
		}
		const recovery = [randomBytes(64).toString('hex')];
		const savedUser = await create<IUserDocument>(UserModel, newUserValidation, {
			alias,
			password,
			email,
			department,
			lastName,
			name,
			recovery
		});
		if (Array.isArray(savedUser)) {
			throw new BaseError();
		}
		await updateRepository<IDepartmentDocument>(
			DepartmentModel,
			{ _id: department },
			{ $addToSet: { users: savedUser._id } }
		);
		return {
			alias: savedUser.alias,
			token: signJWT(savedUser.id, savedUser.isAdmin, email!),
			role: 'user'
		};
	}
};

export const login = async ({
	email,
	password
}: Partial<IUser>): Promise<{ alias: string; token: string; role: string }> => {
	await loginUserValidation.validateAsync({ email, password });

	const user = (
		await read<IUserDocument>(
			UserModel,
			{ email },
			{ limit: 0, offset: 0 },
			{ select: '+password' }
		)
	)[0];
	if (!user || !user.validatePassword(password as string))
		throw new BaseError('Incorrect data', 401);
	return {
		alias: user.alias,
		token: signJWT(user.id, user.isAdmin, email!),
		role: user.isAdmin ? 'admin' : 'user'
	};
};
