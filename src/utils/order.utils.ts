type orderString = 'asc' | 'des';
type orderNumber = 1 | -1;

export class OrderAggregate {
	'notes.title'?: orderNumber;
	'date.year'?: orderNumber;
	'notes.tags.name'?: orderNumber;
	constructor({
		title,
		year,
		tags
	}: {
		title?: orderString;
		year?: orderString;
		tags?: orderString;
	}) {
		this['notes.title'] = this.transform(title);
		this['date.year'] = this.transform(year);
		this['notes.tags.name'] = this.transform(tags);
	}

	private transform(direction?: orderString): orderNumber | undefined {
		if (direction) return direction === 'asc' ? 1 : -1;
	}
}
