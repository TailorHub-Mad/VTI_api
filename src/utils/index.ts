import { OrderAggregate } from './order.utils';

export * from './controllers.utils';

export const purgeObj = (object: { [key: string]: any }): { [key: string]: 1 | -1 } => {
	Object.keys(object).forEach((key) => object[key] === undefined && delete object[key]);
	console.log(object);
	return object;
};
