const schemas = require('@/lib/express/routes/socket/schemas');

function getZodError(data) {
  const result = schemas.InitSchema.safeParse(data);
  if (result.success) return null;

  console.error(result.error.errors[0].message);

  return result.error.errors[0].message;
} 

module.exports = getZodError;