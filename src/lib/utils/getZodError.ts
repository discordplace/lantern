import { z } from 'zod';

/**
 * Parses the given data using the schema and returns the first error message if validation fails.
 *
 * @param data - The data to be validated.
 * @param schema - The schema to validate the data against.
 * @returns The first error message if validation fails, otherwise null.
 */
function getZodError(data: unknown, schema: z.ZodSchema<unknown>): string | null {
  const result = schema.safeParse(data);
  if (result.success) return null;

  return result.error.errors[0].message;
}

export default getZodError;