import { FILE_EXT } from '@constants/error_messages.constants';
import { BaseError } from './base.error';

export class FileError extends BaseError {
	constructor(message?: string) {
		super(message || FILE_EXT, 400);
	}
}
