/*
  my brain is completely fired
  I can't think of anything to write here :(
*/

const dateFns = require('date-fns');
const axios = require('axios');
const badges = require('@/lib/constants/badges');
const status = require('@/lib/constants/status');
const Discord = require('discord.js');
const he = require('he');

function activityElapsedTime(activity) {
  const startTime = new Date(activity.start_time.raw);
  const elapsedTime = dateFns.differenceInSeconds(new Date(), startTime);
  const humanReadable = dateFns.format(new Date(elapsedTime * 1000), 'mm:ss');

  return `${humanReadable} elapsed`;
}

async function createSvg(userData, options = {}) {
  const variables = {
    colors: options.theme === 'dark' ? config.user_svg_card.colors.dark : config.user_svg_card.colors.light,
    statusColors: {
      online: '#43b581',
      idle: '#faa61a',
      dnd: '#f04747',
      offline: '#747f8d'
    }
  };

  const icons = {
    FaImage: (width, height, fill) => `<svg stroke="currentColor" fill="${fill}" stroke-width="0" viewBox="0 0 512 512" height="${height}px" width="${width}px" xmlns="http://www.w3.org/2000/svg"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"></path></svg>`
  };

  const currentStatus = Object.values(userData.active_platforms).find(platform => platform.status !== 'offline') || 'offline';

  let div_height = 225;
  let svg_height = 300;

  // Remove custom status activity from activities array
  userData.activities = userData.activities.filter(activity => activity.type !== Discord.ActivityType.Custom);

  const images = [
    {
      id: 'display_avatar',
      url: userData.metadata.display_avatar_url
    },
    {
      id: 'large_image',
      url: userData.activities[0]?.assets?.large_image?.image_url
    },
    {
      id: 'small_image',
      url: userData.activities[0]?.assets?.small_image?.image_url
    }
  ];

  await Promise.all(images
    .filter(image => image.url)
    .map(async image => {
      const response = await axios.get(image.url, { responseType: 'arraybuffer' })
        .catch(() => null);

      if (!response?.data) return;

      const base64 = Buffer.from(response.data, 'binary').toString('base64');

      image.base64 = base64;

      return image;
    }));

  return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="1000" height="${svg_height}">         
      <foreignObject x="0" y="0" width="1000" height="${svg_height}">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          position: absolute;
          width: 600px;
          height: ${div_height}px;
          inset: 0;
          font-family: sans-serif;
          background-color: ${variables.colors.background};
          color: ${variables.colors.text.primary};
          font-size: 16px;
          border-radius: ${options.borderRadius}rem;
          padding: .75rem;
          top: 3rem;
        ">
          <div
            style="
              position: absolute;
              bottom: 1rem;
              right: 1rem;
              font-size: 0.75rem;
              font-weight: 500;
              color: ${variables.colors.text.secondary};
              padding-top: 0.5rem;
              padding-left: 1rem;
              padding-right: 1rem;
              padding-bottom: 0.5rem;
              border-radius: ${options.borderRadius}rem;
              background-color: ${variables.colors.background_secondary};
              letter-spacing: 0.5px;
            "
          >
            Powered by lantern.rest
          </div>

          <div style="
            pointer-events: none; 
            position: relative; 
            display: flex; 
            align-items: center; 
            width: 100%; 
            margin-bottom: -7rem;
            left: 2rem; 
            bottom: 3.5rem;
          ">
            <div style="
              position: relative;
              width: 100px;
              height: 100px;
              border-radius: 50%;
              border: solid 8px ${variables.colors.background};
              background-color: ${variables.colors.background};
            ">
              <img 
                alt="${he.escape(userData.metadata.username)}'s avatar"
                loading="lazy" 
                width="128" 
                height="128" 
                decoding="async" 
                style="
                  border-radius: 50%; 
                  width: 100px; 
                  height: 100px;
                  color: transparent;
                " 
                src="data:image/png;base64,${images.find(image => image.id === 'display_avatar').base64}"
              />

              ${!options.hideStatus ? `
                <div style="
                  position: absolute;
                  width: 26px;
                  height: 26px;
                  border-radius: 50%;
                  border: 6px solid ${variables.colors.background};
                  bottom: 0;
                  right: 0;
                  background-color: ${variables.colors.background};
                ">
                  <img
                    alt="Status"
                    loading="lazy"
                    width="26"
                    height="26"
                    decoding="async"
                    src="data:image/png;base64,${status.find(({ id }) => id === currentStatus).base64}"
                  />
                </div>
              ` : ''}
            </div>
          </div>

          <div style="
            display: flex;
            justify-content: space-between;
            width: 100%;
          ">
            <div style="
              display: flex;
              flex-direction: column;
              gap: 0.25rem;
              margin-left: 27%;
            ">
              <div style="
                display: flex;
                align-items: center;
                gap: 0.5rem;
              ">
                <div style="
                  ${!options.hideGlobalName ? `
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: ${variables.colors.text.secondary};
                  ` : `
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: ${variables.colors.text.primary};
                  `}
                ">
                  @${he.escape(userData.metadata.username)}
                </div>

                ${!options.hideBadges ? `
                  <div style="
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    margin-left: 0.25rem;
                  ">
                    ${userData.metadata.flags.human_readable.map(flag => `
                      <img
                        alt="Badge ${flag}"
                        loading="lazy"
                        width="16"
                        height="16"
                        decoding="async"
                        style="width: 16px; height: 16px;"
                        src="data:image/svg+xml;base64,${badges.find(image => image.id === flag).base64}"
                      />
                    `).join('')}
                  </div>
                ` : ''}
              </div>
              ${!options.hideGlobalName ? `
                <div style="
                  display: flex;
                  align-items: center;
                  font-size: 1.125rem;
                  font-weight: 600;
                  color: ${variables.colors.text.primary};
                ">
                  ${he.escape(userData.metadata.global_name)}
                </div>
              ` : ''}
            </div>
          </div>

          ${!options.hideActivity && userData.activities.length > 0 ? `
            <div style="
              width: 100%;
              height: 1px;
              background-color: ${variables.colors.background_secondary};
              margin-top: 2rem;
              margin-bottom: 1rem;
            "/>
          
            <div style="
              display: grid;
              gap: 1rem;
              margin-left: 0.5rem;
              grid-template-columns: 1fr 1fr;
            ">
              <div style="
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
              ">              
                <div style="
                  width: 100%;
                  height: max-content;
                  background-color: ${variables.colors.background_secondary};
                  border-radius: 1rem;
                  display: flex;
                  padding: 1rem;
                  gap: 1rem;
                  display: flex;
                  flex-direction: column;
                  padding: 1rem;
                ">
                  <div style="
                    display: flex;
                    flex-direction: row;
                    gap: 1rem;
                  ">
                    <div style="
                      min-width: 80px;
                      min-height: 80px;
                      border-radius: 1rem;
                      background-color: ${variables.colors.background};
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      position: relative;
                    ">
                      <div style="
                        position: relative;
                        width: 80px;
                        height: 80px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      ">
                        ${userData.activities[0].assets?.large_image?.image_url ? `
                          <img
                            alt="Large image"
                            loading="lazy"
                            width="80"
                            height="80"
                            decoding="async"
                            style="
                              width: 100%;
                              height: 100%;
                              position: absolute;
                              top: 0;
                              left: 0;
                              color: transparent;
                              border-radius: 1rem;
                            "
                            src="data:image/png;base64,${images.find(image => image.id === 'large_image').base64}"
                          />
                        ` : `
                          ${icons.FaImage(50, 50, variables.colors.text.secondary)}
                        `}

                        ${userData.activities[0].assets?.small_image?.image_url ? `
                          <img
                            alt="Small image"
                            loading="lazy"
                            width="32"
                            height="32"
                            decoding="async"
                            style="
                              width: 32px;
                              height: 32px;
                              position: absolute;
                              border-radius: 50%;
                              bottom: -0.5rem;
                              right: -0.5rem;
                              color: transparent;
                            "
                            src="data:image/png;base64,${images.find(image => image.id === 'small_image').base64}"
                          />
                        ` : ''}
                      </div>
                    </div>

                    <div style="
                      display: flex;
                      flex-direction: column;
                      gap: 0.25rem;
                      align-items: flex-start;
                      justify-content: center;
                    ">
                      <div style="
                        font-weight: 600;
                        color: ${variables.colors.text.primary};
                      ">
                        ${he.escape(userData.activities[0].name)}
                      </div>

                      ${userData.activities[0].details ? `
                        <div style="
                          color: ${variables.colors.text.secondary};
                          white-space: nowrap;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          max-width: 200px;
                          font-size: 0.875rem;
                        ">
                          ${he.escape(userData.activities[0].details)}
                        </div>
                      ` : ''}

                      ${userData.activities[0].state ? `
                        <div style="
                          color: ${variables.colors.text.secondary};
                          white-space: nowrap;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          font-size: 0.875rem;
                        ">
                          ${he.escape(userData.activities[0].state)}
                        </div>
                      ` : ''}

                      <div style="
                        color: ${variables.colors.text.secondary};
                        font-size: 0.875rem;
                        font-weight: 500;
                      ">
                        ${activityElapsedTime(userData.activities[0])}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ` : `
            <div style="
              width: 100%;
              height: 1px;
              background-color: ${variables.colors.background_secondary};
              margin-top: 2rem;
              margin-bottom: 1rem;
            "/>

            <div
              style="
                margin-top: 3rem;
              "
            >
              <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.125rem;
                font-weight: 600;
                color: ${variables.colors.text.primary};
              ">
                ${he.escape(options.noActivityTitle)}
              </div>

              <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.875rem;
                font-weight: 500;
                color: ${variables.colors.text.secondary};
              ">
                ${he.escape(options.noActivityMessage)}
              </div>
            </div>
          `}
        </div>
      </foreignObject>
    </svg>
  `;
}

module.exports = createSvg;