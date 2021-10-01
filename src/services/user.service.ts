import { BaseError } from '@errors/base.error';
import { encryptPassword } from '@utils/model.utils';
import { randomBytes } from 'crypto';
import { sendMail } from '../config/nodemailer.config';
import { IUserDocument } from '../interfaces/models.interface';
import { UserModel } from '../models/user.model';
import { updateRepository } from '../repositories/common.repository';
import { recoveryValidation, resetPasswordValidation } from '../validations/user.validation';

export const resetPassword = async (
	body: { email: string },
	isRecovery: boolean
): Promise<void> => {
	const validateEmail = await resetPasswordValidation.validateAsync(body);
	const recovery = randomBytes(64).toString('hex');
	const user = updateRepository<IUserDocument>(
		UserModel,
		{ email: validateEmail.email },
		{
			$push: { recovery }
		}
	);

	if (!user) throw new BaseError('Not found user', 400);
	const url = `${process.env.FRONT_URL}/${
		isRecovery ? 'recuperar' : 'crear-contraseña'
	}/${recovery}`;
	await sendMail({
		to: validateEmail.email,
		subject: 'Recovery',
		html: `<a href=${url}>RECOVERY</a>`
	});
};

export const recovery = async (body: { password: string; recovery: string }): Promise<void> => {
	const validateRecovery = await recoveryValidation.validateAsync(body);

	await updateRepository<IUserDocument>(
		UserModel,
		{
			recovery: { $in: [validateRecovery.recovery] }
		},
		{
			$pull: { recovery: validateRecovery.recovery },
			password: encryptPassword(validateRecovery.password)
		}
	);
};
