const envVars = {
  DISCORD_BOT_TOKEN: /[\w-]{24}\.[\w-]{6}\.[\w-]{38}/,
  MONGODB_URI: /^mongodb:\/\/.+/,
  MONGODB_NAME: /^[\w-]+$/,
  KV_TOKEN_ENCRYPTION_SECRET: /^[\w]{64}$/,
  NODE_ENV: /^(development|production)$/
};

const optionalEnvVars = [''];

for (const [key, regex] of Object.entries(envVars)) {
  const value = process.env[key];
  if (regex && !regex.test(value || '')) {
    if (optionalEnvVars.includes(key) && value === undefined) continue;

    logger.warn(`Environment variable ${key} has an invalid value: ${value}`);
  };
}