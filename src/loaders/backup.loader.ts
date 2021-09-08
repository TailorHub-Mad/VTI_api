import { spawn } from 'child_process';
import path from 'path';

// Create interval for 4h and 1 week.
// Delete files.

function toJSONLocal() {
	const date = new Date();
	const local = new Date(date);
	local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	return local.toJSON().slice(0, 10);
}
// console.log('--');
// console.log(path.join(process.cwd(), 'backup', `${toJSONLocal()}.gz`));
console.log(`--archive=${path.join(process.cwd(), 'backup', `${toJSONLocal()}`)}`);
const backupProcess = spawn('mongodump', [
	`--archive="${path.join(process.cwd(), 'backup', `${toJSONLocal()}`)}"`,
	'--uri="mongodb://localhost:27017/vti-dev"'
	// '--nsFrom="vti-dev.*"',
	// '--nsTo="vti-backup.*"'
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
