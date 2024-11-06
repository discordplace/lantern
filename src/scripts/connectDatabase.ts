import mongoose from 'mongoose';
import { CronJob } from 'cron';
import createMongoBackup from '@/scripts/createMongoBackup';

mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_NAME })
  .then(() => {
    logger.log('database', 'Connected to database.');

    if (config.database.backup.enabled) {
      logger.log('database', 'Database backup enabled.');

      new CronJob(config.database.backup.cron_pattern, async () => {
        try {
          await createMongoBackup();

          logger.info('Database backup taken successfully.');
        } catch (error) {
          logger.error('Failed to take backup:');
          logger.error(error);
        }
      }, null, true);
    }
  });
