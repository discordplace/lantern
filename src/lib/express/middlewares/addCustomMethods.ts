import type { Request, Response, NextFunction } from 'express';

function addCustomMethods(_request: Request, response: Response, next: NextFunction): void {
  response.sendError = (message: string, statusCode: number = 500): void => {
    response.status(statusCode).json({
      success: false,
      error: message
    });
  };

  next();
}

export default addCustomMethods;