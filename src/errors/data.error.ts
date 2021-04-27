import { DATA_ERROR } from '@constants/error_messages.constants';
import { BaseError } from './base.error';

export class MissingDataError extends BaseError {
	constructor(message?: string) {
		super(message || DATA_ERROR, 400);
	}
}
