import { findWithPagination, createRepository } from '../../../repositories/common.repository';
import db from '../../../loaders/db.loader';
import { IClient, IClientDocument, IClientModel } from '../../../interfaces/models.interface';
import { ClientModel } from '../../../models/client.model';

beforeAll(async () => {
	await db.open();
});

afterAll(async () => {
	await db.close();
});

describe('CRUD repository', () => {
	describe('createRepository', () => {
		it('Test create client', async () => {
			const fakerClient: Partial<IClient> = {
				name: 'Test2 Name1234',
				alias: 'Test2 Alias1234'
			};

			const newClient = await createRepository<IClientDocument>(ClientModel, fakerClient);

			expect(newClient).toBeDefined();
			expect(newClient.name).toBe(fakerClient.name);
			expect(newClient.alias).toBe(fakerClient.alias);
		});
	});
});
