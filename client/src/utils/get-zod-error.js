import { fromError } from 'zod-validation-error';

function getZodError(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success) return fromError(result.error).message;

  return null;
}

export default getZodError;