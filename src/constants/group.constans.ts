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

export const PROJECT_NOTES = {
	$project: {
		'notes.tags._id': 1,
		'notes.tags.name': 1,
		'notes.year': 1,
		'notes.readBy': 1,
		'notes.isClosed': 1,
		'notes.formalized': 1,
		'notes._id': 1,
		'notes.ref': 1,
		'notes.title': 1,
		'notes.description': 1,
		'notes.link': 1,
		'notes.documents': 1,
		'notes.owner._id': 1,
		'notes.owner.name': 1,
		'notes.owner.lastName': 1,
		'notes.owner.alias': 1,
		'notes.owner.ref': 1,
		'notes.owner.email': 1,
		'notes.messages._id': 1,
		'notes.messages.approved': 1,
		'notes.messages.formalized': 1,
		'notes.messages.message': 1,
		'notes.messages.documents': 1,
		'notes.messages.owner._id': 1,
		'notes.messages.owner.alias': 1,
		'notes.messages.owner.name': 1,
		'notes.messages.owner.lastName': 1,
		'notes.messages.owner.ref': 1,
		'notes.messages.owner.documents': 1,
		'notes.messages.owner.updateLimitDate': 1,
		'notes.messages.owner.createdAt': 1,
		'notes.messages.owner.updatedAt': 1,
		'notes.updateLimitDate': 1,
		'notes.createdAt': 1,
		'notes.updatedAt': 1,
		'notes.clientAlias': 1,
		'notes.clientId': 1,
		'notes.projects._id': 1,
		'notes.projects.alias': 1,
		'notes.projects.date': 1,
		'notes.projects.ref': 1,
		'notes.projects.closed': 1,
		'notes.testSystems._id': 1,
		'notes.testSystems.vtiCode': 1,
		'notes.testSystems.alias': 1,
		'notes.testSystems.ref': 1,
		'notes.isAnswered': 1,
		'notes.isDocuments': 1
	}
};

export const PROJECT_TESTSYSTEMS = {
	$project: {
		'testSystems.projects._id': 1,
		'testSystems.projects.alias': 1,
		'testSystems.projects.ref': 1,
		'testSystems.projects.closed': 1,
		'testSystems.projects.date': 1,
		'testSystems.notes.tags.name': 1,
		'testSystems.notes.tags.ref': 1,
		'testSystems.notes.tags._id': 1,
		'testSystems.notes.readBy': 1,
		'testSystems.notes.isClosed': 1,
		'testSystems.notes.formalized': 1,
		'testSystems.notes._id': 1,
		'testSystems.notes.title': 1,
		'testSystems.notes.description': 1,
		'testSystems.notes.link': 1,
		'testSystems.notes.documents': 1,
		'testSystems.notes.ref': 1,
		'testSystems.notes.messages': 1,
		'testSystems.notes.updateLimitDate': 1,
		'testSystems.notes.updatedAt': 1,
		'testSystems.notes.projects._id': 1,
		'testSystems.notes.projects.date': 1,
		'testSystems.notes.projects.closed': 1,
		'testSystems.notes.projects.alias': 1,
		'testSystems.notes.projects.ref': 1,
		'testSystems.notes.owner._id': 1,
		'testSystems.notes.owner.name': 1,
		'testSystems.notes.owner.alias': 1,
		'testSystems.notes.owner.ref': 1,
		'testSystems.notes.owner.email': 1,
		'testSystems.notes.owner.lastName': 1,
		'testSystems._id': 1,
		'testSystems.vtiCode': 1,
		'testSystems.alias': 1,
		'testSystems.ref': 1,
		'testSystems.updatedAt': 1,
		'testSystems.createdAt': 1,
		'testSystems.clientAlias': 1,
		'testSystems.clientId': 1
	}
};

export const PROJECT_PROJECTS = {
	$project: {
		'projects.focusPoint._id': 1,
		'projects.focusPoint.name': 1,
		'projects.focusPoint.lastName': 1,
		'projects.focusPoint.email': 1,
		'projects.focusPoint.ref': 1,
		'projects.focusPoint.alias': 1,
		'projects.testSystems._id': 1,
		'projects.testSystems.vtiCode': 1,
		'projects.testSystems.alias': 1,
		'projects.testSystems.ref': 1,
		'projects.tags.ref': 1,
		'projects.tags.name': 1,
		'projects.tags._id': 1,
		'projects.notes.tags.name': 1,
		'projects.notes.tags.ref': 1,
		'projects.notes.tags._id': 1,
		'projects.notes.readBy': 1,
		'projects.notes.isClosed': 1,
		'projects.notes.formalized': 1,
		'projects.notes._id': 1,
		'projects.notes.title': 1,
		'projects.notes.description': 1,
		'projects.notes.link': 1,
		'projects.notes.documents': 1,
		'projects.notes.ref': 1,
		'projects.notes.messages': 1,
		'projects.notes.updateLimitDate': 1,
		'projects.notes.updatedAt': 1,
		'projects.notes.testSystems._id': 1,
		'projects.notes.testSystems.vtiCode': 1,
		'projects.notes.testSystems.alias': 1,
		'projects.notes.testSystems.ref': 1,
		'projects.notes.owner._id': 1,
		'projects.notes.owner.name': 1,
		'projects.notes.owner.alias': 1,
		'projects.notes.owner.ref': 1,
		'projects.notes.owner.email': 1,
		'projects.notes.owner.lastName': 1,
		'projects._id': 1,
		'projects.alias': 1,
		'projects.sector._id': 1,
		'projects.sector.title': 1,
		'projects.sector.ref': 1,
		'projects.date': 1,
		'projects.ref': 1,
		'projects.clientAlias': 1,
		'projects.clientId': 1,
		'projects.isActive': 1,
		'projects.createdAt': 1,
		'projects.updatedAt': 1,
		'projects.closed': 1
	}
};
