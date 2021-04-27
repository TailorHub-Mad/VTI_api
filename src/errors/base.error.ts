import { STATUS_CODES } from 'http';

export class BaseError extends Error {
	status: number;
	code?: string;
	constructor(message?: string, status?: number, code?: string) {
		super();

		Error.captureStackTrace(this, this.constructor);

		this.name = this.constructor.name;

		this.status = status || 500;
		this.message = message || (STATUS_CODES[this.status] as string);
		this.code = code;
	}
}
