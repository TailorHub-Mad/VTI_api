import mongoose from 'mongoose';
import { DATABASEURL } from '@constants/env.constants';
import logger from '@log';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const mongodb = async () => {
	try {
		const mongoConnection = await mongoose.connect(DATABASEURL, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false
		});
		const databaseName = mongoConnection.connections[0].db.databaseName;
		logger.info(`Connected to Mongo! Database name ${databaseName}`);
		return mongoConnection;
	} catch (error) {
		logger.error(`Error connecting to mongo database, Error description: ${error}`);
	}
};
