import { spawn } from 'child_process';
import path from 'path';

function toJSONLocal() {
	const date = new Date();
	const local = new Date(date);
	local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	return local.toJSON().slice(0, 10);
}
// console.log('--');
// console.log(path.join(process.cwd(), 'backup', `${toJSONLocal()}.gz`));
const backupProcess = spawn('mongodump', [
	'--db=vti-dev',
	`--archive=${path.join(process.cwd(), 'backup', `${toJSONLocal()}.gz`)}`,
	'--gzip'
]);

backupProcess.on('exit', (code, signal) => {
	if (code) {
		logger.info(`Backup process exited with code ${code}`);
	} else if (signal) {
		logger.error(`Backup process was killed with singal ${signal}`);
	} else {
		logger.info('Successfully backedup the database');
	}
});
