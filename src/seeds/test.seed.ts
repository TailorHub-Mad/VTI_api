import logger from '@log';
import { Document } from 'mongoose';
import { TestModel } from '../models/test.model';

export default async (brands: Document[]): Promise<void> => {
	const nameModel = TestModel.collection.name;
	logger.info(nameModel);
	await TestModel.deleteMany({});
	logger.info(`Borrado de la base de datos ${nameModel}`);

	const createTest = (length: number) => {
		return {
			name: `pepe${length}`,
			age: length,
			car: brands[length].id
		};
	};

	const tests = new Array(5).fill(undefined).map((_, index) => createTest(index));
	await TestModel.insertMany(tests);
};
