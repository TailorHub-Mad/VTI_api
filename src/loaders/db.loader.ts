import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DATABASEURL } from '@constants/env.constants';

mongoose.set('debug', true);

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	keepAlive: true,
	keepAliveInitialDelay: 300000,
	autoIndex: true, // Dev == true; Prod == false
	serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
	socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
};

class MongoConnection {
	private static _instance: MongoConnection;

	private _mongoServer?: MongoMemoryServer;

	static getInstance(): MongoConnection {
		if (!MongoConnection._instance) {
			MongoConnection._instance = new MongoConnection();
		}
		return MongoConnection._instance;
	}

	public async open(): Promise<void> {
		try {
			if (DATABASEURL === 'inmemory') {
				logger.debug('connecting to inmemory mongo db');
				this._mongoServer = new MongoMemoryServer();
				const mongoUrl = await this._mongoServer.getUri();
				await mongoose.connect(mongoUrl, options);
			} else {
				logger.debug('connecting to mongo db: ' + DATABASEURL);
				mongoose.connect(DATABASEURL, options);
			}

			mongoose.connection.on('connected', () => {
				logger.info('Mongo: connected');
			});

			mongoose.connection.on('disconnected', () => {
				logger.error('Mongo: disconnected');
			});

			mongoose.connection.on('error', (err) => {
				logger.error(`Mongo:  ${String(err)}`);
				if (err.name === 'MongoNetworkError') {
					setTimeout(function () {
						mongoose.connect(DATABASEURL, options).catch(logger.error);
					}, 5000);
				}
			});
		} catch (err) {
			logger.error(`db.open: ${err}`);
			throw err;
		}
	}

	public async close(): Promise<void> {
		try {
			await mongoose.disconnect();
			if (DATABASEURL === 'inmemory') {
				await this._mongoServer?.stop();
			}
		} catch (err) {
			logger.error(`db.open: ${err}`);
			throw err;
		}
	}
}

export default MongoConnection.getInstance();
