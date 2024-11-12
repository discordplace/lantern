/* eslint-disable @typescript-eslint/no-explicit-any */

import type * as Discord from 'discord.js';

type Restrictions = {
  guildOnly?: boolean;
  ownerOnly?: boolean;
  baseGuildOnly?: boolean;
  users?: {
    allow?: string[];
    deny?: string[];
  };
  roles?: {
    allow?: string[] | number[];
    deny?: string[] | number[];
  };
  permissions?: {
    allow?: Discord.PermissionResolvable[];
    deny?: Discord.PermissionResolvable[];
  };
} | null;

type CommandMetadata = {
  global?: boolean;
} | null;

type AutocompleteOption = {
  name: string,
  value: string | number
}

export type CommandType = {
  json: Discord.APIApplicationCommand | any,
  metadata?: CommandMetadata,
  data: {
    [key: string]: {
      restrictions: Restrictions,
      execute: {
        command: (interaction: Discord.ChatInputCommandInteraction, { subcommand, group }: { subcommand: string | null, group: string | null }) => Promise<any> | void,
        component?: {
          [key: string]: (interaction: Discord.MessageComponentInteraction, { args }: { args: string[] }) => Promise<any> | void
        },
        modal?: {
          [key: string]: (interaction: Discord.ModalSubmitInteraction, { args }: { args: string[] }) => Promise<any> | void
        },
        autocomplete?: (interaction: Discord.AutocompleteInteraction, { subcommand, group }: { subcommand: string | null, group: string | null }) => Promise<AutocompleteOption[]> | AutocompleteOption[]
      }
    }
  }
}

export type CronType = {
  pattern: string,
  execute: () => Promise<void>,
  executeOnStart?: boolean,
  name: string
}

export type EventType = {
  [K in keyof Discord.ClientEvents]: {
    name: K;
    execute: (...args: [...Discord.ClientEvents[K]]) => Promise<void> | void;
  };
}[keyof Discord.ClientEvents];

declare module 'express' {
  interface Request {
    clientIp: string;
  }

  interface Response {
    sendError: (message: string, statusCode: number) => void;
  }
}

declare module 'discord.js' {
  interface Client {
    commands: Discord.Collection<string, CommandType>;
    crons: Discord.Collection<string, CronType>;
    events: Discord.Collection<string, EventType>;
  }

  interface CommandInteraction {
    success: (content: string, options?: Discord.InteractionReplyOptions) => Promise<void>;
    error: (content: string, options?: Discord.InteractionReplyOptions) => Promise<void>;
  }

  interface MessageComponentInteraction {
    success: (content: string, options?: Discord.InteractionReplyOptions) => Promise<void>;
    error: (content: string, options?: Discord.InteractionReplyOptions) => Promise<void>;
  }
}

export type UserData = {
  metadata: {
    id: string,
    username: string,
    discriminator: string,
    global_name: string | null,
    avatar: string | null,
    avatar_url: string | null,
    display_avatar_url: string,
    bot: boolean,
    flags: {
      human_readable: string[],
      bitfield: number | null | undefined
    },
    monitoring_since: {
      unix: number | null,
      raw: Date | null
    }
  },
  status: string,
  active_platforms: Record<string, string | Record<string, string>>,
  activities: (CustomStatusActivity | OtherActivity)[],
  storage: Map<string, string> | {}
}

export type CustomStatusActivity = {
  name: 'Custom Status',
  type: Discord.ActivityType.Custom,
  emoji: Discord.Emoji | null,
  text: string | null,
  start_time: {
    unix: number,
    raw: Date
  },
  end_time: {
    unix: number,
    raw: Date
  } | null
}

export type OtherActivity = {
  name: string,
  type: keyof typeof Discord.ActivityType,
  state: string | null,
  details: string | null,
  created_at: number,
  assets?: {
    large_image: {
      hash?: string,
      image_url?: string,
      text: string
    },
    small_image: {
      hash?: string,
      image_url?: string,
      text: string
    }
  },
  timestamps?: {
    start_time: {
      unix: number,
      raw: Date
    }
  }
}

export type APIUsersGETRequestQuery = {
  svg?: number;
  theme?: 'light' | 'dark';
  borderRadius?: string;
  hideGlobalName?: string;
  hideStatus?: string;
  hideBadges?: string;
  hideActivity?: string;
  noActivityTitle?: string;
  noActivityMessage?: string;
}

export type CreateSvgOptions = Omit<APIUsersGETRequestQuery, 'svg'>;