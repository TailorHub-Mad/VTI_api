import { CronJob } from 'cron';
import { backup } from '../loaders/backup.loader';

export const cronjobs = (): void => {
	// eslint-disable-next-line no-new
	new CronJob(
		'* * 04 * * *',
		() => {
			backup();
		},
		null,
		true,
		'Europe/Madrid'
	).start();
	new CronJob(
		'00 00 00 * * *',
		() => {
			backup();
		},
		null,
		true,
		'Europe/Madrid'
	).start();
	new CronJob(
		'00 00 00 * * 0-6',
		() => {
			backup();
		},
		null,
		true,
		'Europe/Madrid'
	).start();
};
