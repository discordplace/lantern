import type { Logger } from 'winston';
import type { Client } from 'discord.js';
import type { WebSocket } from 'ws';
import type * as Discord from 'discord.js';

type Config = {
  bypass_command_permissions_check: string[];
  base_guild_id: string;
  max_bulk_get_users_size: number;
  server: ServerConfig;
  logger: LoggerConfig;
  database: DatabaseConfig;
  user_svg_card: UserSVGCardConfig;
}

type ServerConfig = {
  port: number;
  socket: ServerSocketConfig;
}

export declare enum ServerSocketOpcodes {
  HELLO = 1,
  INIT = 2,
  INIT_ACK = 3,
  HEARTBEAT = 4,
  HEARTBEAT_ACK = 5,
  PRESENCE_UPDATE = 6,
  USER_LEFT = 7,
  USER_JOINED = 8,
  DISCONNECT = 9,
  STORAGE_UPDATE = 10,
  ERROR = 11,
  SUBSCRIBE = 12,
  SUBSCRIBE_ACK = 13,
  UNSUBSCRIBE = 14,
  UNSUBSCRIBE_ACK = 15
}

type ServerSocketConfig = {
  heartbeat_interval: number;
  maxpayload: number;
  clienttracking: boolean;
  keepalive: boolean;
  opcodes: typeof ServerSocketOpcodes;
  client_allowed_opcodes: number[];
}

type LoggerConfig = {
  levels: LoggerLevels;
}

type LoggerLevels = {
  error: string;
  warn: string;
  info: string;
  debug: string;
  database: string;
  bot: string;
  http: string;
  socket: string;
  [key: string]: string;
}

type DatabaseConfig = {
  backup: DatabaseBackupConfig;
}

type DatabaseBackupConfig = {
  output_dir: string;
  enabled: boolean;
  discord_channel: string;
  cron_pattern: string;
  exclude_collections: string[];
}

type UserSVGCardConfig = {
  colors: {
    dark: {
      background: string;
      background_secondary: string;
      card: string;
      text: {
        primary: string;
        secondary: string;
      }
    },
    light: {
      background: string;
      background_secondary: string;
      card: string;
      text: {
        primary: string;
        secondary: string;
      }
    }
  }
}

type ActiveSocketData = {
  instance: WebSocket,
  lastHeartbeat: number,
  subscribed: string | string[]
}

export type ActiveSockets = Discord.Collection<string, ActiveSocketData>;

declare global {
  var config: Config;
  var logger: Logger;
  var client: Client;
  var ActiveSockets: ActiveSockets;
  var getWss: () => WebSocket;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      DISCORD_BOT_TOKEN: string;
      MONGODB_URI: string;
      MONGODB_NAME: string;
      KV_TOKEN_ENCRYPTION_SECRET: string;
    }
  }
}

export { Config };