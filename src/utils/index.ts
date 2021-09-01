export * from './controllers.utils';

export const purgeObj = (object: { [key: string]: any }): { [key: string]: 1 | -1 } | undefined => {
	Object.keys(object).forEach((key) => object[key] === undefined && delete object[key]);
	if (Object.keys(object).length === 0) {
		return;
	}
	return object;
};
