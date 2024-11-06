import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const validateRequest = (request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(400).json({ errors: errors.array()[0].msg });

  next();
};

export default validateRequest;