import type { Response } from 'express';
import User from '@/models/User';

export const get = [
  async (_, response: Response) => {
    const currentlyMonitoringUsers = await User.countDocuments();

    return response.json({
      data: {
        info: 'Lantern provides Discord presences as an API and WebSocket. Find out more here: https://github.com/discordplace/lantern',
        discord_invite: 'https://invite.lantern.rest',
        currently_monitoring_users: currentlyMonitoringUsers
      }
    });
  }
];