import 'dotenv/config';
import logger from '@log';
import dbLoader from '../loaders/db.loader';
import testSeed from './test.seed';
(async () => {
	await dbLoader.open();
	try {
		await testSeed();
	} catch (err) {
		logger.error(err.message);
	} finally {
		await dbLoader.close();
		logger.info('Disconnect DB.');
		process.exit();
	}
})();
