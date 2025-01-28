import * as Discord from 'discord.js';
import * as dateFns from 'date-fns';
import type { UserData, ClientPresenceStatus, ClientPresenceStatusData } from '@/src/types';

/**
 * Creates a user data object for a given user ID and key-value storage.
 *
 * @param {string} user_id - The ID of the user to create data for.
 * @param {Map<string, string> | {}} kv - A key-value storage object or map.
 * @returns {UserData} The user data object containing metadata, status, active platforms, activities, and storage.
 * @throws {Error} If the base guild or member is not found.
 */
function createUserData(user_id: string, kv: Map<string, string> | {}): UserData {
  const guild = client.guilds.cache.get(config.base_guild_id);
  if (!guild) throw new Error('Base guild not found.');

  const member = guild.members.cache.get(user_id);
  if (!member) throw new Error('Member not found.');

  const activePlatforms = {
    desktop: member.presence?.clientStatus?.desktop as ClientPresenceStatus || 'offline',
    mobile: member.presence?.clientStatus?.mobile as ClientPresenceStatus || 'offline',
    web: member.presence?.clientStatus?.web as ClientPresenceStatus || 'offline',
    spotify: null
  } as ClientPresenceStatusData;

  const spotifyActivity = member.presence?.activities.find(activity => activity.name === 'Spotify');

  if (spotifyActivity) {
    // Calculate current human-readable time relative to start time
    const currentTime = new Date();
    const startTime = spotifyActivity.timestamps?.start || new Date();
    const endTime = spotifyActivity.timestamps?.end || new Date();

    const elapsedTime = dateFns.differenceInSeconds(currentTime, startTime);
    const currentHumanReadable = dateFns.format(new Date(elapsedTime * 1000), 'mm:ss');

    // Calculate human-readable end time
    const totalDuration = dateFns.differenceInSeconds(endTime, startTime);
    const endHumanReadable = dateFns.format(new Date(totalDuration * 1000), 'mm:ss');

    const artistCount = spotifyActivity.state?.split('; ').length || 0;

    activePlatforms.spotify = {
      track_id: spotifyActivity.syncId,
      song: spotifyActivity.details,
      artist: artistCount > 1 ? spotifyActivity.state?.split('; ') : spotifyActivity.state,
      album: spotifyActivity.assets?.largeText,
      album_cover: spotifyActivity.assets?.largeImageURL(),
      start_time: {
        unix: spotifyActivity.timestamps?.start?.getTime(),
        raw: spotifyActivity.timestamps?.start
      },
      end_time: {
        unix: spotifyActivity.timestamps?.end?.getTime(),
        raw: spotifyActivity.timestamps?.end
      },
      time: {
        current_human_readable: currentHumanReadable,
        end_human_readable: endHumanReadable
      }
    };
  }

  const parsedActivites = [];

  for (const activity of member.presence?.activities || []) {
    switch (activity.name) {
      case 'Custom Status':
        parsedActivites.push({
          name: activity.name,
          type: 4,
          emoji: activity.emoji,
          text: activity.state,
          start_time: {
            unix: activity.createdTimestamp,
            raw: activity.createdAt
          },
          end_time: activity.timestamps?.end ? {
            unix: activity.timestamps.end.getTime(),
            raw: activity.timestamps.end
          } : null
        });
        break;
      default:
        var activityData = {
          name: activity.name,
          type: activity.type as unknown as keyof typeof Discord.ActivityType,
          state: activity.state,
          details: activity.details,
          application_id: activity.applicationId,
          created_at: activity.createdTimestamp
        };

        if (activity.assets) {
          Object.assign(activityData, {
            assets: {
              large_image: {
                hash: activity.assets.largeImage,
                image_url: activity.assets.largeImageURL(),
                text: activity.assets.largeText
              },
              small_image: {
                hash: activity.assets.smallImage,
                image_url: activity.assets.smallImageURL(),
                text: activity.assets.smallText
              }
            }
          });
        }

        if (activity.timestamps) {
          Object.assign(activityData, {
            timestamps: {
              start_time: {
                unix: activity.timestamps?.start?.getTime(),
                raw: activity.timestamps.start
              }
            }
          });
        }

        parsedActivites.push(activityData);

        break;
    }
  }

  const baseObject = {
    metadata: {
      id: user_id,
      username: member.user.username,
      discriminator: member.user.discriminator,
      global_name: member.user.globalName,
      avatar: member.user.avatar,
      avatar_url: member.user.avatarURL(),
      display_avatar_url: member.user.displayAvatarURL(),
      bot: member.user.bot,
      flags: {
        human_readable: new Discord.UserFlagsBitField(member.user.flags?.bitfield)
          .toArray(),
        bitfield: member.user.flags?.bitfield
      },
      monitoring_since: {
        unix: member.joinedTimestamp,
        raw: member.joinedAt
      }
    },
    active_platforms: activePlatforms,
    activities: parsedActivites,
    storage: kv
  };

  if (member.presence?.status === 'offline' && client.lastSeens.has(user_id)) {
    const lastSeen = client.lastSeens.get(user_id);
    const lastSeenDate = new Date(lastSeen);

    return {
      ...baseObject,
      status: 'offline',
      last_seen_at: {
        unix: lastSeenDate.getTime(),
        raw: lastSeenDate
      }
    };
  } else {
    return {
      ...baseObject,
      status: member.presence?.status as Exclude<string, 'offline'>,
      last_seen_at: {
        unix: null,
        raw: null
      }
    };
  }
}

export default createUserData;