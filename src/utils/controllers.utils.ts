import { Pagination } from '../interfaces/config.interface';
import QueryString = require('qs');

export const getPagination = (query?: QueryString.ParsedQs): Pagination => {
	const { offset = 0, limit = 0 } = query || {};
	return { offset: +offset, limit: +limit };
};

export const isSameArray = (array: string[], compareArray: string[]): string | undefined => {
	if (array.length > compareArray.length) {
		return array.slice(-1)[0];
	}
};
