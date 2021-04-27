import { errorHandler } from '../../../src/middleware';
import { IError } from '../../../src/interfaces/error-http.interface';
import { MockRequest, MockResponse, createRequest, createResponse } from 'node-mocks-http';
import { Request, Response, NextFunction } from 'express';

describe('Middleware Error-Handler', () => {
  const next = {} as NextFunction;
  let req: MockRequest<Request>;
  let res: MockResponse<Response>;

  beforeEach(() => {
    req = createRequest();
    res = createResponse();
    global.logger.info = jest.fn();
    jest.clearAllMocks();
  });

  it("should return error 500 if not error hasn't status", () => {
    errorHandler(new Error(), req, res, next);

    expect(res.statusCode).toBe(500);
  });
});
