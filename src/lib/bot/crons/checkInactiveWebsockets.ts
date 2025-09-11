import { disconnect } from '@/express/routes/socket/utils';
import type { CronType } from '@/src/types';

export default {
  pattern: '*/10 * * * * *',
  execute: async () => {
    if (!global.ActiveSockets) return;

    for (const [id, { lastHeartbeat, instance }] of ActiveSockets.entries()) {
      if (Date.now() - lastHeartbeat > config.server.socket.heartbeat_interval) {
        disconnect(instance, id, 'Connection timed out.');
      }
    }
  },
  name: 'checkInactiveWebsockets'
} satisfies CronType;