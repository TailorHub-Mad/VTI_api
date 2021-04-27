import { NO_USER_ERROR } from '@constants/error_messages.constants';
import { BaseError } from './base.error';

export class AuthorizationError extends BaseError {
	constructor(message?: string) {
		super(message || NO_USER_ERROR, 401);
	}
}
