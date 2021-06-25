import { createRepository } from '../../../repositories/common.repository';
import db from '../../../loaders/db.loader';
import { IClient, IClientDocument } from '../../../interfaces/models.interface';
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
				name: 'Test23 Name12345',
				alias: 'Test23 Alias12345'
			};

			const newClient = await createRepository<IClientDocument>(ClientModel, fakerClient);

			expect(newClient).toBeDefined();
			expect(newClient.name).toBe(fakerClient.name);
			expect(newClient.alias).toBe(fakerClient.alias);
			await newClient.deleteOne();
		});
	});
});
