// Option order by projects.

export const GROUP_PROJECT = ['client', 'years', 'sector', 'date.year'] as const;

// Notes.

export const GROUP_NOTES = ['title', 'year', 'sector', 'notes.tags.name'] as const;

// Test System.

export const GROUP_TEST_SYSTEM = ['alias', 'year', 'CodVTI', 'sector'] as const;

// Users.

export const GROUP_USER = ['department'] as const;

export enum Test {
	'year' = 'date.year',
	'tags' = 'notes.tags.name',
	'sector' = 'testSystem.sector',
	'department' = 'department'
}
