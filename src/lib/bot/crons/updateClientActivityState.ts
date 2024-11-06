import * as Discord from 'discord.js';
import User from '@/models/User';
import type { CronType } from '@/src/types';

export default {
  pattern: '0 */3 * * *',
  execute: async () => {
    const currentlyMonitoringUsers = await User.countDocuments();

    const state = `Monitoring ${currentlyMonitoringUsers} users`;

    client.user!.setActivity({
      type: Discord.ActivityType.Custom,
      name: state,
      state
    });

    logger.log('bot', `Updated activity to "${state}".`);
  },
  executeOnStart: true,
  name: 'updateClientActivityState'
} satisfies CronType;