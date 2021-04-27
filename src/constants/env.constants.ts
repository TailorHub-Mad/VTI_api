export const PORT = process.env.PORT || 3001;

export const DATABASEURL =
	(process.env.NODE_ENV === 'development'
		? process.env.DATABASEURL_DEV
		: process.env.DATABASEURL_PROD) || 'mongodb://localhost:27017/baseback';
