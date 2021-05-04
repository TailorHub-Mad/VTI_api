import 'dotenv/config';
import logger from '@log';
import brandSeed from './brand.seed';
import dbLoader from '../loaders/db.loader';
import testSeed from './test.seed';
(async () => {
	await dbLoader.open();
	try {
		const brands = await brandSeed();
		await testSeed(brands);
	} catch (err) {
		logger.error(err.message);
	} finally {
		await dbLoader.close();
		logger.info('Disconnect DB.');
		process.exit();
	}
})();
