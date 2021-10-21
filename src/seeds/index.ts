import 'dotenv/config';
import logger from '@log';
import dbLoader from '../loaders/db.loader';
import testSeed from './client.seed';
// import script from './script';
(async () => {
	await dbLoader.open();
	try {
		await testSeed();
		// await script();
	} catch (err) {
		logger.error(err.message);
	} finally {
		await dbLoader.close();
		logger.info('Disconnect DB.');
		process.exit();
	}
})();
