const missingEnvironmentVariables = config.required_environment_variables.filter(key => !process.env[key]);
if (missingEnvironmentVariables.length > 0) {
  logger.error(`Missing environment variables: ${missingEnvironmentVariables.join(', ')}`);
  process.exit(1);
}