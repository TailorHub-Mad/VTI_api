import { BaseError } from './base.error';

export class SendCodeError extends BaseError {
	constructor(message?: string, code?: string) {
		super(message, 400, code);
	}
}
