# 🔦 Lantern: Illuminate Your Discord Presence with Real-Time API and WebSocket

Lantern is a powerful service designed to effortlessly broadcast your active Discord status to both a RESTful API endpoint (`lantern.rest/api/v1/users/:your_id`) and a WebSocket connection. Want to showcase your current Spotify tracks on your personal site? Lantern has you covered.

While Lantern is ready to use out-of-the-box without the need for any deployment, it also offers the flexibility for self-hosting with minimal setup. Enjoy seamless integration and real-time updates with Lantern.

---

## API Docs

##### GET `/api/v1/users/:id`

Retrieve the data of a user with the specified ID.

##### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| `id` | string | The ID of the user to retrieve. |
| `svg` | boolean | Whether to return the user's avatar as an SVG image. Defaults to `false`. |
| `theme` | string | The theme to use for the user's card. Must be either `light` or `dark`. |
| `borderRadius` | number | The border radius to use for the user's card. |
| `hideGlobalName` | number | Whether to hide the user's global name. Must be either `0` or `1`. |
| `hideStatus` | number | Whether to hide the user's status. Must be either `0` or `1`. |
| `hideBadges` | number | Whether to hide the user's badges. Must be either `0` or `1`. |
| `hideActivity` | number | Whether to hide the user's activity. Must be either `0` or `1`. |

##### Response
<details>
<summary>
  Example Response
</summary>

```json
{
  // User metadata object
  "metadata": {
    "id": "123456789012345678",
    "username": "example",
    "discriminator": "0",
    "global_name": "example",
    "avatar": "abcdef1234567890",
    "avatar_url": "https://cdn.discordapp.com/avatars/123456789012345678/123456789012345678.png",
    "display_avatar_url": "https://cdn.discordapp.com/avatars/123456789012345678/123456789012345678.png",
    "bot": false,
    "flags": {
      "human_readable": ["DISCORD_EMPLOYEE"],
      "bitfield": 1
    },
    "monitoring_since": {
      "unix": 1620000000,
      "raw": "2021-05-03T00:00:00.000Z"
    }
  },
  "status": "online",
  // Active platforms object with current Spotify track
  "active_platforms": {
    "desktop": "online",
    "mobile": "offline",
    "web": "offline",
    "spotify": {
      "track_id": "abcdef1234567890",
      "song": "example",
      "artist": "example",
      "album": "example",
      "album_cover": "https://i.scdn.co/image/abcdef1234567890",
      "start_time": {
        "unix": 1620000000,
        "raw": "2021-05-03T00:00:00.000Z"
      },
      "end_time": {
        "unix": 1620000000,
        "raw": "2021-05-03T00:00:00.000Z"
      },
      "time": {
        "start_human_readable": "00:00",
        "end_human_readable": "00:00"
      }
    }
  },
  // Array of user activities
  "activities": [
    {
      "id": "abcdef1234567890",
      "name": "example",
      "type": "PLAYING",
      "state": "example",
      "details": "example",
      "application_id": "123456789012345678",
      "created_at": 1620000000,
      "assets": {
        "large_image": {
          "hash": "abcdef1234567890",
          "image_url": "https://cdn.discordapp.com/app-assets/123456789012345678/abcdef1234567890.png",
          "text": "example"
        },
        "small_image": {
          "hash": "abcdef1234567890",
          "image_url": "https://cdn.discordapp.com/app-assets/123456789012345678/abcdef1234567890.png",
          "text": "example"
        }
      },
      "start_time": {
        "unix": 1620000000,
        "raw": "2021-05-03T00:00:00.000Z"
      }
    }
  ]
}
```
</details>

## WebSocket

The WebSocket connection is available at `wss://lantern.rest/socket`.

Once connected, you will receive `Opcode 1: Hello` which will contain `heartbeat_interval` in the data field.

You should set a repeating interval for the time specified in `heartbeat_interval` which should send Opcode 4: Heartbeat on the interval.

You should send `Opcode 2: Initialize` immediately after receiving `Opcode 1: Hello` with the following payload:

<details>
  <summary>
    Subscribe to User
  </summary>
  
  ```json
  {
    "op": 2,
    "d": {
      "user_id": "123456789012345678"
    }
  }
  ```
</details>

<details>
  <summary>
    Subscribe to Multiple Users
  </summary>

  ```json
  {
    "op": 2,
    "d": {
      "user_ids": ["123456789012345678", "234567890123456789"]
    }
  }
  ```
</details>

<details>
  <summary>
    Subscribe to All Users
  </summary>

  ```json
  {
    "op": 2,
    "d": {
      "user_ids": ["All"]
    }
  }
  ```
</details>
<br/>

You will receive `Opcode 3: Initialize Acknowledgement` once the server has acknowledged your subscription and this will contain the all data for the user(s) you have subscribed to in the `d` field.

If any user you have subscribed to updates their presence, you will receive `Opcode 6: Presence Update` with the updated data in the `d` field.

If any user you have subscribed leaves the Lantern server, you will receive `Opcode 7: User Left` with the user ID in the `d` field. (when subscribing to multiple users, you will receive this for each user that leaves, if no users are left, you will receive `Opcode 9: Disconnect`)

##### List of Opcodes
| Opcode | Description | Type |
| ------ | ----------- | ---- |
| 1 | HELLO | Server -> Client |
| 2 | INIT | Client -> Server |
| 3 | INIT_ACK | Server -> Client |
| 4 | HEARTBEAT | Client -> Server |
| 5 | HEARTBEAT_ACK | Server -> Client |
| 6 | PRESENCE_UPDATE | Server -> Client |
| 7 | USER_LEFT | Server -> Client |
| 8 | USER_JOINED | Server -> Client |
| 9 | DISCONNECT | Server -> Client |

##### Example Payloads

<details>
  <summary>
    Opcode 1: Hello
  </summary>

  ```json
  {
    "t": "HELLO",
    "op": 1,
    "d": {
      "heartbeat_interval": 10000
    }
  }
  ```
</details>

<details>
  <summary>
    Opcode 2: Initialize
  </summary>

  ```json
  {
    "t": "INIT",
    "op": 2,
    "d": {
      "user_id": "123456789012345678"
    }
  }
  ```
</details>

<details>
  <summary>
    Opcode 3: Initialize Acknowledgement
  </summary>

  ```json
  {
    "t": "INIT_ACK",
    "op": 3
  }
  ```
</details>

<details>
  <summary>
    Opcode 4: Heartbeat
  </summary>

  ```json
  {
    "t": "HEARTBEAT",
    "op": 4
  }
  ```
</details>

<details>
  <summary>
    Opcode 5: Heartbeat Acknowledgement
  </summary>

  ```json
  {
    "t": "HEARTBEAT_ACK",
    "op": 5
  }
  ```
</details>

<details>
  <summary>
    Opcode 6: Presence Update
  </summary>

  ```json
  {
    "t": "PRESENCE_UPDATE",
    "op": 6,
    "d": {
      // Updated user data
      // Can be array if multiple users are subscribed
    }
  }
  ```
</details>

<details>
  <summary>
    Opcode 7: User Left
  </summary>

  ```json
  {
    "t": "USER_LEFT",
    "op": 7,
    "d": {
      "user_id": "123456789012345678"
    }
  }
  ```
</details>

<details>
  <summary>
    Opcode 8: User Joined
  </summary>

  ```json
  {
    "t": "USER_JOINED",
    "op": 8,
    "d": {
      // User data
    }
  }
  ```
</details>

<details>
  <summary>
    Opcode 9: Disconnect
  </summary>

  ```json
  {
    "t": "DISCONNECT",
    "op": 9,
    "d": {
      "reason": "Connection timed out."
    }
  }
  ```
</details>

---

## Self-Hosting

To self-host Lantern, you will need to have the following prerequisites installed on your system:

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm) (usually comes with Node.js)
- [Git](https://git-scm.com/downloads)
- [MongoDB](https://www.mongodb.com/try/download/community)

Once you have the prerequisites installed, follow these steps to self-host Lantern:

1. Clone the repository to your local machine:

```bash
git clone
```

2. Navigate to the cloned repository:

```bash
cd lantern/server
```

3. Install the required dependencies:

```bash
npm install
```

4. Create a `.env` file in the `server` directory with the following environment variables:

```env
DISCORD_BOT_TOKEN=your_discord_bot_token
MONGODB_URI=your_mongodb_uri

# For GitHub Auto Deploy (not needed for local development)
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret
```

5. Fill these configuration values in the `config.toml` file with your own values:

```toml
base_guild_id = '1253092552404631582'

[server]
port = 3003
```

6. Start the server:

```bash
npm start
```

7. The server should now be running on `http://localhost:3003`. You can access the API and WebSocket connection from this URL.

> [!NOTE]  
> __**Make sure you enable**__ these settings in your bot's application settings:
> - `PRESENCE INTENT`
> - `GUILD MEMBERS INTENT`

## Contributing

We welcome contributions from the community! If you'd like to contribute to the project, please follow these guidelines:

1. Fork the repository and clone it locally.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure the code passes any existing tests.
4. Commit your changes with descriptive commit messages.
5. Push your changes to your fork and submit a pull request to the `main` branch of the original repository.

Please make sure to follow the [Code of Conduct](.github/CODE_OF_CONDUCT.md) and [Contributing Guidelines](.github/CONTRIBUTING.md) when contributing to this project.

## Help

If you encounter any issues with the Lantern or have any questions, feel free to [open an issue](https://github.com/discordplace/lantern/issues) on this repository. We'll do our best to assist you!

## License

This project is licensed under the [ISC License](LICENSE).