import mongoose from 'mongoose';
import apiError from './apiError.js'; // Your custom error handling utility

// Utility function to validate MongoDB ObjectId
const validateObjectId = (id, fieldName = '_id') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new apiError(400, `Invalid ${fieldName} provided`);
  }
};

export default validateObjectId
