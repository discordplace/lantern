import * as Discord from 'discord.js';
import { CronJob } from 'cron';
import { toString } from 'cronstrue';
import type { CronType } from '@/src/types';

function listenCrons(crons: Discord.Collection<string, CronType>) {
  crons.forEach(cron => {
    new CronJob(cron.pattern, cron.execute, null, true);

    if (cron.executeOnStart) {
      cron.execute();
    };

    logger.info(`Cron ${cron.name} scheduled. ${toString(cron.pattern)}.`);
  });
}

export default listenCrons;