import nodemailer, { SendMailOptions } from 'nodemailer';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

const createTransport = async () => {
	const oauth2Client = new OAuth2(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET,
		'https://developers.google.com/oauthplayground'
	);
	oauth2Client.setCredentials({
		refresh_token: process.env.REFRESH_TOKEN
	});

	const accessToken: string = await new Promise((resolve, reject) => {
		oauth2Client.getAccessToken((err, token) => {
			// eslint-disable-next-line prefer-promise-reject-errors
			if (err) reject('Failed to create access token.');

			resolve(token as string);
		});
	});

	return nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			type: 'OAuth2',
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			user: process.env.EMAIL_USER,
			refreshToken: process.env.REFRESH_TOKEN,
			accessToken: accessToken,
			expires: 3600
		}
	});
};

export const sendMail = async (
	mailBody: SendMailOptions & { template?: string; context?: unknown }
): Promise<void> => {
	const transporter = await createTransport();

	new Promise(
		(resolve, reject) =>
			transporter.sendMail(
				{
					...mailBody,
					from: process.env.EMAIL_USER
				},
				function (err) {
					if (err) {
						err.message = 'No se ha podido enviar el email.';
						reject(err);
					} else resolve(undefined);
				}
			)
		// eslint-disable-next-line no-console
	).catch(console.error);
};
