import nodemailer, { SendMailOptions } from 'nodemailer';

export const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});

export const sendMail = (
	mailBody: SendMailOptions & { template?: string; context?: unknown }
): Promise<unknown> =>
	new Promise((resolve, reject) =>
		transporter.sendMail({ ...mailBody, from: process.env.EMAIL_USER }, function (err) {
			if (err) {
				err.message = 'No se ha podido enviar el email.';
				reject(err);
			} else {
				resolve(undefined);
			}
		})
	);
