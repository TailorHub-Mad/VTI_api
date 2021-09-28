// Option order by projects.

export const GROUP_PROJECT = [
	'client',
	'years',
	'sector.0.title',
	'date.year',
	'projects.tags.name',
	'tags'
] as const;

// Notes.

export const GROUP_NOTES = ['title', 'year', 'sector', 'notes.tags.name', 'tags'] as const;

// Test System.

export const GROUP_TEST_SYSTEM = [
	'alias',
	'date.year',
	'vtiCode',
	'sector',
	'client',
	'ref'
] as const;

// Users.

export const GROUP_USER = ['department'] as const;

export enum Test {
	'year' = 'date.year',
	'tags' = 'notes.tags.name',
	'sector' = 'testSystems.sector',
	'department' = 'department'
}
