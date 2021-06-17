import { STATUS_CODES } from 'http';
import { BaseError } from '../../../errors/base.error';

describe('BaseError', () => {
	const baseError = new BaseError();
	it('shoud return error 500 if status is not provided', () => {
		expect(baseError.status).toBe(500);
	});
	it('should return default message if message is not provided', () => {
		expect(baseError.message).toBe(STATUS_CODES[500]);
	});
	it('should assign message if it is provided', () => {
		const baseErrorMessage = new BaseError('Message');
		expect(baseErrorMessage.message).toBe('Message');
	});
	it('name should be the constructor name', () => {
		expect(baseError.name).toBe('BaseError');
	});
	it('should assign status if it is provided', () => {
		const baseErrorStatus404 = new BaseError('', 404);
		expect(baseErrorStatus404.status).toBe(404);
	});
	it('should assign code if it is provided', () => {
		const baseErrorCode = new BaseError(undefined, undefined, 'COD01');
		expect(baseErrorCode.code).toBe('COD01');
	});
});
