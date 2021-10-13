type orderString = 'asc' | 'des';
type orderNumber = 1 | -1;

export class OrderAggregate {
	'notes.title'?: orderNumber;
	'date.year'?: orderNumber;
	'notes.tags.name'?: orderNumber;
	'projects.ref'?: orderNumber;
	'projects.alias'?: orderNumber;
	'projects.sector.title'?: orderNumber;
	'projects.focusPoint.0.name'?: orderNumber;
	'sector.ref'?: orderNumber;
	'sector.title'?: orderNumber;
	'department.ref'?: orderNumber;
	'department.name'?: orderNumber;
	'testSystems.ref'?: orderNumber;
	'testSystems.alias'?: orderNumber;
	'testSystems.vtiCode'?: orderNumber;
	'testSystems.clientAlias'?: orderNumber;
	'testSystems.date.year'?: orderNumber;
	'ref'?: orderNumber;
	'title'?: orderNumber;
	'alias'?: orderNumber;
	'name'?: orderNumber;
	constructor({
		title,
		year,
		tags,
		projects_ref,
		projects_alias,
		projects_sector,
		projects_focusPoint,
		sector_ref,
		sector_title,
		department_ref,
		department_name,
		testSystems_ref,
		testSystems_alias,
		testSystems_vtiCode,
		testSystems_clientAlias,
		testSystems_date,
		ref,
		alias,
		name
	}: {
		title?: orderString;
		year?: orderString;
		tags?: orderString;
		projects_ref?: orderString;
		projects_alias?: orderString;
		projects_sector?: orderString;
		projects_focusPoint?: orderString;
		sector_ref?: orderString;
		sector_title?: orderString;
		department_ref?: orderString;
		department_name?: orderString;
		testSystems_ref?: orderString;
		testSystems_alias?: orderString;
		testSystems_vtiCode?: orderString;
		testSystems_clientAlias?: orderString;
		testSystems_date?: orderString;
		ref?: orderString;
		alias?: orderString;
		name?: orderString;
	}) {
		this['notes.title'] = this.transform(title);
		this['date.year'] = this.transform(year);
		this['notes.tags.name'] = this.transform(tags);
		this['projects.ref'] = this.transform(projects_ref);
		this['projects.alias'] = this.transform(projects_alias);
		this['projects.sector.title'] = this.transform(projects_sector);
		this['projects.focusPoint.0.name'] = this.transform(projects_focusPoint);
		this.ref = this.transform(sector_ref) || this.transform(ref) || this.transform(department_ref);
		this.title = this.transform(sector_title);
		this.name = this.transform(department_name) || this.transform(name);
		this['testSystems.ref'] = this.transform(testSystems_ref);
		this['testSystems.alias'] = this.transform(testSystems_alias);
		this['testSystems.vtiCode'] = this.transform(testSystems_vtiCode);
		this['testSystems.clientAlias'] = this.transform(testSystems_clientAlias);
		this['testSystems.date.year'] = this.transform(testSystems_date);
		this.alias = this.transform(alias);
	}

	private transform(direction?: orderString): orderNumber | undefined {
		if (direction) return direction === 'asc' ? 1 : -1;
	}
}
