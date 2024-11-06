import { Document } from 'mongoose';

/**
 * Validates a given document and returns the first validation error message, if any.
 *
 * @param {Document} document - The document to validate.
 * @returns {string | null} - The first validation error message, or `null` if there are no errors.
 */
function getValidationError(document: Document): string | null {
  const errors = document.validateSync();
  if (errors) {
    const error = Object.values(errors.errors)[0];

    return error?.message || 'An unknown error occurred.';
  }

  return null;
}

export default getValidationError;