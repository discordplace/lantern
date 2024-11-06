/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Request, Response, NextFunction } from 'express';

function handleErrors(error: Error, _request: Request, response: Response, next: NextFunction): void {
  logger.error(error);

  response.sendError('Internal Server Error', 500);
}

export default handleErrors;