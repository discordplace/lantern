import type { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleNotFound(_request: Request, response: Response, _next: NextFunction): void {
  response.status(404).json({ error: 'Resource not found.' });
}

export default handleNotFound;