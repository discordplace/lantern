const Discord = require('discord.js');
const dateFns = require('date-fns');
  
function createUserData(user_id, kv) {
  const guild = client.guilds.cache.get(config.base_guild_id);
  const member = guild.members.cache.get(user_id);

  const activePlatforms = ['desktop', 'mobile', 'web']
    .map(platform => ({ [platform]: member.presence?.clientStatus[platform] || 'offline' }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const spotifyActivity = member.presence?.activities.find(activity => activity.name === 'Spotify');

  if (spotifyActivity) {
    // Calculate current human-readable time relative to start time
    const currentTime = new Date();
    const startTime = spotifyActivity.timestamps.start;
    const elapsedTime = dateFns.differenceInSeconds(currentTime, startTime);
    const currentHumanReadable = dateFns.format(new Date(elapsedTime * 1000), 'mm:ss');

    // Calculate human-readable end time
    const totalDuration = dateFns.differenceInSeconds(spotifyActivity.timestamps.end, startTime);
    const endHumanReadable = dateFns.format(new Date(totalDuration * 1000), 'mm:ss');

    const artistCount = spotifyActivity.state.split('; ').length;

    Object.assign(activePlatforms, {
      spotify: {
        track_id: spotifyActivity.syncID,
        song: spotifyActivity.details,
        artist: artistCount > 1 ? spotifyActivity.state.split('; ') : spotifyActivity.state,
        album: spotifyActivity.assets.largeText,
        album_cover: spotifyActivity.assets.largeImageURL(),
        start_time: {
          unix: spotifyActivity.timestamps.start.getTime(),
          raw: spotifyActivity.timestamps.start
        },
        end_time: {
          unix: spotifyActivity.timestamps.end.getTime(),
          raw: spotifyActivity.timestamps.end
        },
        time: {
          start_human_readable: currentHumanReadable,
          end_human_readable: endHumanReadable
        }
      }
    });
  }

  const parsedActivites = [];

  for (const activity of member.presence?.activities || []) {
    switch (activity.name) {
      case 'Custom Status':
        parsedActivites.push({
          name: activity.name,
          type: activity.type,
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
          id: activity.id,
          name: activity.name,
          type: activity.type,
          state: activity.state,
          details: activity.details,
          application_id: activity.applicationID,
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
            start_time: {
              unix: activity.timestamps.start.getTime(),
              raw: activity.timestamps.start
            }
          });
        }
      
        parsedActivites.push(activityData);

        break;
    }
  }

  return {
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
        human_readable: new Discord.UserFlagsBitField(member.user.flags)
          .toArray(),
        bitfield: member.user.flags.bitfield
      },
      monitoring_since: {
        unix: member.joinedTimestamp,
        raw: member.joinedAt
      }
    },
    status: member.presence?.status || 'offline',
    active_platforms: activePlatforms,
    activities: parsedActivites,
    storage: kv
  };
}

module.exports = createUserData;