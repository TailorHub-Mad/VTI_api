import '../src/@types/index.d';
import { Logger } from 'winston';

global.logger = {} as Logger;
global.logger.error = jest.fn();
global.logger.warn = jest.fn();
global.logger.info = jest.fn();
global.logger.http = jest.fn();
global.logger.debug = jest.fn();
