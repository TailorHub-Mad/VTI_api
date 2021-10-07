// Option order by projects.

export const GROUP_PROJECT = [
	'clientAlias',
	'alias',
	'years',
	'sector.0.title',
	'date.year',
	'tags.name',
	'tags'
] as const;

// Notes.

export const GROUP_NOTES = [
	'title',
	'year',
	'sector',
	'notes.tags.name',
	'tags',
	'clientAlias',
	'alias'
] as const;

// Test System.

export const GROUP_TEST_SYSTEM = [
	'alias',
	'date.year',
	'vtiCode',
	'sector',
	'clientAlias',
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
