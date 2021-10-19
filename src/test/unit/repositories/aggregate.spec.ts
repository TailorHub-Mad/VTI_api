import { aggregateCrud } from '../../../repositories/aggregate.repository';
import db from '../../../loaders/db.loader';

const pagination = { limit: 0, offset: 0 };

beforeAll(async () => {
	await db.open();
});

afterAll(async () => {
	await db.close();
});

describe('Aggregate', () => {
	describe('Notes', () => {
		it('All notes', async () => {
			const { notes } = (
				await aggregateCrud(
					{ _extends: 'notes', nameFild: 'notes', querys: {}, group: 'null' },
					pagination
				)
			)[0];

			const note = notes[0];
			expect(notes).toBeDefined();
			expect(note).toBeDefined();
		});
		it('Find by title', async () => {
			const { notes } = (
				await aggregateCrud(
					{
						_extends: 'notes',
						nameFild: 'notes',
						querys: { 'notes.title': 'ffbd6bb0409ac228' },
						match: 'ffbd6bb0409ac228'
					},
					pagination
				)
			)[0];

			const note = notes[0];
			expect(notes).toBeDefined();
			expect(notes).toHaveLength(1);
			expect(note).toBeDefined();
			expect(note.title).toBe('ffbd6bb0409ac228');
		});
		it('All notes with limit = 10', async () => {
			pagination.limit = 10;
			const { notes } = (
				await aggregateCrud(
					{ _extends: 'notes', nameFild: 'notes', querys: {}, group: 'null' },
					pagination
				)
			)[0];

			const note = notes[0];
			expect(notes).toHaveLength(10);
			expect(note).toBeDefined();
		});
		it('All notes with limit and page', async () => {
			pagination.limit = 10;
			const { notes: notesPage0 } = (
				await aggregateCrud(
					{ _extends: 'notes', nameFild: 'notes', querys: {}, group: 'null' },
					pagination
				)
			)[0];

			const { notes: notesPage1 } = (
				await aggregateCrud(
					{ _extends: 'notes', nameFild: 'notes', querys: {}, group: 'null' },
					{ ...pagination, ...{ offset: 1 } }
				)
			)[0];

			const notePage0 = notesPage0[0];
			const notePage1 = notesPage1[0];
			expect(notesPage0).toBeDefined();
			expect(notesPage1).toBeDefined();
			expect(notePage0).toBeDefined();
			expect(notePage1).toBeDefined();
			expect(notePage0._id).not.toBe(notePage1._id);
		});
	});

	describe('Clients', () => {
		it('All clients', async () => {
			const clients = await aggregateCrud({ querys: {} }, pagination);
			const client = clients[0];
			expect(clients).toBeDefined();
			expect(client).toBeDefined();
		});
	});

	describe('Test Systems', () => {
		it('All test systems', async () => {
			const { testSystems } = (
				await aggregateCrud(
					{ _extends: 'testSystems', nameFild: 'testSystems', querys: {}, group: 'null' },
					pagination
				)
			)[0];

			const _testSystem = testSystems[0];
			expect(testSystems).toBeDefined();
			expect(_testSystem).toBeDefined();
		});
	});

	describe('Projects', () => {
		it('All Projects', async () => {
			const { projects } = (
				await aggregateCrud(
					{ _extends: 'projects', nameFild: 'projects', querys: {}, group: 'null' },
					pagination
				)
			)[0];

			const project = projects[0];
			expect(projects).toBeDefined();
			expect(project).toBeDefined();
		});
		it('All projects with limit = 10', async () => {
			pagination.limit = 10;
			const { projects } = (
				await aggregateCrud(
					{ _extends: 'projects', nameFild: 'projects', querys: {}, group: 'null' },
					pagination
				)
			)[0];

			const project = projects[0];
			expect(projects).toHaveLength(10);
			expect(project).toBeDefined();
		});
		it('All projects with limit and page', async () => {
			pagination.limit = 10;
			const { projects: projectsPage0 } = (
				await aggregateCrud(
					{ _extends: 'projects', nameFild: 'projects', querys: {}, group: 'null' },
					pagination
				)
			)[0];

			const { projects: projectsPage1 } = (
				await aggregateCrud(
					{ _extends: 'projects', nameFild: 'projects', querys: {}, group: 'null' },
					{ ...pagination, ...{ offset: 1 } }
				)
			)[0];

			const projectPage0 = projectsPage0[0];
			const projectPage1 = projectsPage1[0];
			expect(projectsPage0).toBeDefined();
			expect(projectsPage1).toBeDefined();
			expect(projectPage0).toBeDefined();
			expect(projectPage1).toBeDefined();
			expect(projectPage0._id).not.toBe(projectPage1._id);
		});
		it('All projects limit = 10 with order in year', async () => {
			pagination.limit = 10;
			const { projects: projectsOrderYearDesc } = (
				await aggregateCrud(
					{
						_extends: 'projects',
						nameFild: 'projects',
						querys: {},
						group: 'null'
					},
					pagination,
					{ 'projects.date.year': -1 }
				)
			)[0];

			const { projects: projectsOrderYearAsc } = (
				await aggregateCrud(
					{
						_extends: 'projects',
						nameFild: 'projects',
						querys: {},
						group: 'null'
					},
					pagination,
					{ 'projects.date.year': 1 }
				)
			)[0];

			const projectOrderYearDesc = projectsOrderYearDesc[0];
			const projectOrderYearAsc = projectsOrderYearAsc[0];

			expect(projectsOrderYearDesc).toBeDefined();
			expect(projectsOrderYearAsc).toBeDefined();
			expect(projectOrderYearDesc).toBeDefined();
			expect(projectOrderYearAsc).toBeDefined();
			expect(+projectOrderYearDesc.date.year > +projectOrderYearAsc.date.year).toBe(true);
			expect(+projectOrderYearAsc.date.year > +projectOrderYearDesc.date.year).toBe(false);
		});
	});

	// it('test TestSystem', async () => {
	// 	const testSystem = await aggregateCrud(
	// 		{ querys: { _id: Types.ObjectId('60ca31d23a9b1bba16659bf9') } },
	// 		{ limit: 0, offset: 0 }
	// 	);

	// 	console.log(testSystem);

	// 	expect(true).toEqual(true);
	// });
});
