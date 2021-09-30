export * from './controllers.utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const purgeObj = (object: { [key: string]: any }): { [key: string]: 1 | -1 } | undefined => {
	Object.keys(object).forEach((key) => object[key] === undefined && delete object[key]);
	if (Object.keys(object).length === 0) {
		return;
	}
	return object;
};
