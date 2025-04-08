// utils/validationError.js
import { validationResult } from 'express-validator';
import apiError from './apiError.js';

export const handleValidationErrors = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.errors.map((item) => item.msg).join(' ');
    throw new apiError(400, errorMessages);
  }
};
