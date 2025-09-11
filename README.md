# 🔦 Lantern: Illuminate Your Discord Presence with Real-Time API and WebSocket

Lantern is a powerful service designed to effortlessly broadcast your active Discord status to both a RESTful API endpoint (`lantern.rest/api/v1/users/:your_id`) and a WebSocket connection. Want to showcase your current Spotify tracks on your personal site? Lantern has you covered.

While Lantern is ready to use out-of-the-box without the need for any deployment, it also offers the flexibility for self-hosting with minimal setup. Enjoy seamless integration and real-time updates with Lantern.

---

## Table of Contents

- [API Docs](#api-docs)
  - [**GET** `/api/v1/users`](#get-apiv1users)
  - [**GET** `/api/v1/users/:id`](#get-apiv1usersid)
  - [WebSocket](#websocket)
- [KV Storage](#kv-storage)
  - [Use cases](#use-cases)
  - [Limits](#limits)
  - [WebSocket](#websocket-1)
  - [RESTful API](#restful-api)
    * [**GET** `/api/v1/users/:user_id/storage`](#get-apiv1usersuser_idstorage)
    * [**DELETE** `/api/v1/users/:user_id/storage`](#delete-apiv1usersuser_idstorage-requires-authorization-header)
    * [**GET** `/api/v1/users/:user_id/storage/:key`](#get-apiv1usersuser_idstoragekey)
    * [**PUT** `/api/v1/users/:user_id/storage/:key`](#put-apiv1usersuser_idstoragekey-requires-authorization-header)
    * [**PATCH** `/api/v1/users/:user_id/storage/:key`](#patch-apiv1usersuser_idstoragekey-requires-authorization-header)
    * [**DELETE** `/api/v1/users/:user_id/storage/:key`](#delete-apiv1usersuser_idstoragekey-requires-authorization-header)
- [Self-Hosting](#self-hosting)
- [Contributing](#contributing)
- [Help](#help)
- [License](#license)

---

## API Docs

Lantern provides OpenAPI documentation for the RESTful API, which you can access at `https://lantern.rest/docs`. The API offers endpoints to retrieve user data and key-value storage.

You can also refer to the swagger.json file in the repository for the API documentation. The API endpoints are as follows:

#### GET `/api/v1/users`

Retrieve the data of users with the specified IDs.

##### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| `user_ids` | string | The IDs of the users to retrieve. |

> [!NOTE]
> - The `user_ids` parameter should be an array of user IDs. You should include this parameter multiple times for each user ID you want to retrieve.
> - The maximum number of user IDs you can retrieve at once is 50.
> - Example: `?user_ids=123456789012345678&user_ids=234567890123456789`

##### Response
<details>
<summary>
  Example Response
</summary>
  
  ```json
  [
    {
      // User metadata object
      "metadata": {
        "id": "123456789012345678",
        "username": "example",
        "discriminator": "0",
        "global_name": "example",
        "avatar": "abcdef1234567890",
        "avatar_url": "https://cdn.discordapp.com/avatars/123456789012345678/123456789012345678.webp",
        "display_avatar_url": "https://cdn.discordapp.com/avatars/123456789012345678/123456789012345678.webp",
        "bot": false,
        "flags": {
          "human_readable": ["Staff"],
          "bitfield": 1
        },
        "monitoring_since": {
          "unix": 1620000000,
          "raw": "2021-05-03T00:00:00.000Z"
        }
      },
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
            "current_human_readable": "00:00",
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
          "timestamps": {
            "start_time": {
              "unix": 1620000000,
              "raw": "2021-05-03T00:00:00.000Z"
            }
          }
        }
      ],
      // Key-value pairs for the user (if any)
      "storage": {
        "key": "value"
      },
      "server_tag": {
        "guild_id": "987654321098765432",
        "name": "GGEZ",
        "icon_url": "https://cdn.discordapp.com/guild-tag-badges/1234567890123456789/abcdef1234567890.webp"
      },
      "status": "online",
      "last_seen_at": null // This will be { unix: number, raw: string } if the user is offline and the last seen time is available
    },
    // Additional user objects
  ]
```
</details>

##### GET `/api/v1/users/:id`

Retrieve the data of a user with the specified ID.

##### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| `id` | string | The ID of the user to retrieve. |
| `svg` | boolean | Whether to return the user's avatar as an SVG image. Defaults to `false`. |
| `theme` | string | The theme to use for the user's card. Must be either `light` or `dark`. |
| `borderRadius` | number | The border radius rem value for the user's card. Defaults to `2`. |
| `hideGlobalName` | number | Whether to hide the user's global name. Must be either `0` or `1`. |
| `hideStatus` | number | Whether to hide the user's status. Must be either `0` or `1`. |
| `hideBadges` | number | Whether to hide the user's badges. Must be either `0` or `1`. |
| `hideActivity` | number | Whether to hide the user's activity. Must be either `0` or `1`. |
| `hideLastSeen` | number | Whether to hide the user's last seen time. Must be either `0` or `1`. |
| `hideServerTag` | number | Whether to hide the user's server tag. Must be either `0` or `1`. |
| `noActivityTitle` | string | The title to display when the user has no activity. Default might be `No Activity`. Can't be greater than 64 characters. |
| `noActivityMessage` | string | The message to display when the user has no activity. Default might be `This user is not currently doing anything.`. Can't be greater than 256 characters. |

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
    "avatar_url": "https://cdn.discordapp.com/avatars/123456789012345678/123456789012345678.webp",
    "display_avatar_url": "https://cdn.discordapp.com/avatars/123456789012345678/123456789012345678.webp",
    "bot": false,
    "flags": {
      "human_readable": ["Staff"],
      "bitfield": 1
    },
    "monitoring_since": {
      "unix": 1620000000,
      "raw": "2021-05-03T00:00:00.000Z"
    }
  },
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
        "current_human_readable": "00:00",
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
      "timestamps": {
        "start_time": {
          "unix": 1620000000,
          "raw": "2021-05-03T00:00:00.000Z"
        }
      }
    }
  ],
  // Key-value pairs for the user (if any)
  "storage": {
    "key": "value"
  },
  "server_tag": {
    "guild_id": "987654321098765432",
    "name": "GGEZ",
    "icon_url": "https://cdn.discordapp.com/guild-tag-badges/1234567890123456789/abcdef1234567890.webp"
  },
  "status": "online",
  "last_seen_at": null // This will be { unix: number, raw: string } if the user is offline and the last seen time is available
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
      "user_id": "All"
    }
  }
  ```
</details>
<br/>

You will receive `Opcode 3: Initialize Acknowledgement` once the server has acknowledged your subscription and this will contain the all data for the user(s) you have subscribed to in the `d` field.

If any user you have subscribed to updates their presence, you will receive `Opcode 6: Presence Update` with the updated data in the `d` field.

If any user you have subscribed leaves the Lantern server, you will receive `Opcode 7: User Left` with the user ID in the `d` field. (when subscribing to multiple users, you will receive this for each user that leaves, if no users are left, you will receive `Opcode 9: Disconnect`)

Additionally, if you want to add or remove a user from your subscription, you can also send `Opcode 12: Subscribe` and `Opcode 14: Unsubscribe` respectively. Note that, if you remove all users from your subscription, you will receive `Opcode 9: Disconnect`.

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
| 10 | STORAGE_UPDATE | Server -> Client |
| 11 | ERROR | Server -> Client |
| 12 | SUBSCRIBE | Client -> Server |
| 13 | SUBSCRIBE_ACK | Server -> Client |
| 14 | UNSUBSCRIBE | Client -> Server |
| 15 | UNSUBSCRIBE_ACK | Server -> Client |

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
    "op": 3,
    "d": {
      // User data
      // Can be array if multiple users are subscribed
    }
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

<details>
  <summary>
    Opcode 10: Storage Update
  </summary>

  ```json
  {
    "t": "STORAGE_UPDATE",
    "op": 10,
    "d": {
      // All key-value pairs for the user
      "key": "value"
    }
  }
  ```
</details>

<details>
  <summary>
    Opcode 11: Error
  </summary>

  ```json
  {
    "t": "ERROR",
    "op": 11,
    "d": "Something went wrong."
  }
  ```
</details>

<details>
  <summary>
    Opcode 12: Subscribe
  </summary>

  ```json
  {
    "op": 12,
    "d": {
      "user_id": "123456789012345678"
    }
  }
  ```

  ```json
  {
    "op": 12,
    "d": {
      "user_ids": ["123456789012345678", "234567890123456789"]
    }
  }
  ```

  ```json
  {
    "op": 12,
    "d": {
      "user_id": "All"
    }
  }
  ```
</details>

<details>
  <summary>
    Opcode 13: Subscribe Acknowledgement
  </summary>

  ```json
  {
    "t": "SUBSCRIBE_ACK",
    "op": 13
  }
  ```
</details>

<details>
  <summary>
    Opcode 14: Unsubscribe
  </summary>

  ```json
  {
    "op": 14,
    "d": {
      "user_id": "123456789012345678"
    }
  }
  ```

  ```json
  {
    "op": 14,
    "d": {
      "user_ids": ["123456789012345678", "234567890123456789"]
    }
  }
  ```

  ```json
  {
    "op": 14,
    "d": {
      "user_id": "All"
    }
  }
  ```
</details>

<details>
  <summary>
    Opcode 15: Unsubscribe Acknowledgement
  </summary>

  ```json
  {
    "t": "UNSUBSCRIBE_ACK",
    "op": 15
  }
  ```
</details>

---

## KV Storage

Lantern also offers a simple key-value storage system that can be accessed through the RESTful API, WebSocket or the Lantern bot itself.

#### Use cases
- Configuration values for your website
- Dynamic data for your website/profile (e.g. current location)
- User-specific data (e.g. user preferences)
- Temporary data storage

#### Limits
1. Keys and values can only be strings (You can store JSON objects as strings)
2. Values can be 30,000 characters maximum
3. Keys must be alphanumeric (a-Z, A-Z, 0-9) and 255 characters max length
4. You can only store up to 512 key-value pairs linked

#### WebSocket

You can access the KV storage through the WebSocket connection. The following opcodes are available for the KV storage:

##### Opcode 10: Storage Update

This opcode is sent when a key-value pair is created, updated or deleted.

##### Payload

```json
{
  "t": "STORAGE_UPDATE",
  "op": 10,
  "d": {
    // All key-value pairs for the user
    "key": "value"
  }
}
```

#### RESTful API

For requests to the KV storage API, you will need to include the `Authorization` header with the value you get from the Lantern bot (use `/storage create token` command). The bot will provide you with a unique token that you can use to access the KV storage.

Without the `Authorization` header, you can only access the data you have stored with the bot itself.

##### GET `/api/v1/users/:user_id/storage`

Retrieve all key-value pairs for a specific user.

##### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| `user_id` | string | The ID of the user to retrieve the key-value pairs from. |

##### Response

<details>
<summary>
  Example Response
</summary>
  
  ```json
  {
    "key1": "value1",
    "key2": "value2"
  }
  ```
</details>

##### DELETE `/api/v1/users/:user_id/storage` (Requires `Authorization` header)

Delete all key-value pairs for a specific user.

##### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `user_id` | string | The ID of the user to delete the key-value pairs from. |

##### Response

<details>
<summary>
  Example Response
</summary>

  ```json
  {
    "success": true
  }
  ```
</details>

##### GET `/api/v1/users/:user_id/storage/:key`

Retrieve the value of a key for a specific user.

##### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| `user_id` | string | The ID of the user to retrieve the key from. |
| `key` | string | The key to retrieve the value for. |

##### Response
<details>
<summary>
  Example Response
</summary>

  ```json
  {
    "value": "example_value"
  }
  ```
</details>

##### PUT `/api/v1/users/:user_id/storage/:key` (Requires `Authorization` header)

Create a new key-value pair for a specific user.

##### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| `user_id` | string | The ID of the user to create the key-value pair for. |
| `key` | string | The key to create. |
| `value` | string | The value to assign to the key. |

##### Response
<details>
<summary>
  Example Response
</summary>

  ```json
  {
    "success": true
  }
  ```
</details>

##### PATCH `/api/v1/users/:user_id/storage/:key` (Requires `Authorization` header)

Update the value of a key for a specific user.

##### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| `user_id` | string | The ID of the user to update the key-value pair for. |
| `key` | string | The key to update. |
| `value` | string | The new value to assign to the key. |

##### Response
<details>
<summary>
  Example Response
</summary>

  ```json
  {
    "success": true
  }
  ```
</details>

##### DELETE `/api/v1/users/:user_id/storage/:key` (Requires `Authorization` header)

Delete a key-value pair for a specific user.

##### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| `user_id` | string | The ID of the user to delete the key-value pair from. |
| `key` | string | The key to delete. |

##### Response
<details>
<summary>
  Example Response
</summary>

  ```json
  {
    "success": true
  }
  ```
</details>

---

## Self-Hosting

To self-host Lantern, you will need to have the following prerequisites installed on your system:

- [Node.js](https://nodejs.org/en/download/) (v22.x won't work, recommend using v21.x)
- [pnpm](https://pnpm.io/installation)
- [Git](https://git-scm.com/downloads)
- [MongoDB](https://www.mongodb.com/try/download/community)

Once you have the prerequisites installed, follow these steps to self-host Lantern:

1. Clone the repository to your local machine:

```bash
git clone https://github.com/discordplace/lantern.git
```

2. Navigate to the cloned repository:

```bash
cd lantern
```

3. Install the required dependencies:

```bash
pnpm install
```

4. Rename the `.env.example` file to `.env` and fill in the configuration values:

```env
DISCORD_BOT_TOKEN=your_discord_bot_token
MONGODB_URI=your_mongodb_uri
MONGODB_NAME=your_mongodb_name
KV_TOKEN_ENCRYPTION_SECRET=your_256_bit_encryption_secret
```

> [!NOTE]
> - `KV_TOKEN_ENCRYPTION_SECRET` should be a 256-bit encryption secret that you generate. You can use a tool like [this](https://asecuritysite.com/encryption/plain). This secret is used to encrypt the KV storage token. So make sure to keep it secure.

5. Fill these configuration values in the `config.toml` file with your own values:

```toml
base_guild_id = 'your_base_guild_id'

[server]
port = 8000
```

6. Start the server. This builds the app and starts the server:

```bash
pnpm start
```

7. The server should now be running on `http://localhost:8000`. You can access the API from this URL. The WebSocket connection is available at `ws://localhost:8000/socket`.

8. (Optional) To register/unregister bot commands, run the following command:

```bash
npm run bot:registerCommands
```
  
```bash
npm run bot:unregisterCommands
```

> [!NOTE]  
> __**Make sure you enable**__ these settings in your bot's application settings:
> - `PRESENCE INTENT`
> - `GUILD MEMBERS INTENT`

> [!NOTE]  
> __**For production use**__ you should connect your domain to Cloudflare. Without Cloudflare, the server will not be able to get the visitor's IP addresses. In development environment, server will use `unknown` as the IP addresses.

## Contributing

We welcome contributions from the community! If you'd like to contribute to the project, please follow these guidelines:

1. Fork the repository and clone it locally.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure the code passes any existing tests.
4. Commit your changes with descriptive commit messages that follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard.
5. Push your changes to your fork and submit a pull request to the `main` branch of the original repository.

Please make sure to follow the [Code of Conduct](.github/CODE_OF_CONDUCT.md) and [Contributing Guidelines](.github/CONTRIBUTING.md) when contributing to this project.

## Help

If you encounter any issues with the Lantern or have any questions, feel free to [open an issue](https://github.com/discordplace/lantern/issues) on this repository. We'll do our best to assist you!

## License

This project is licensed under [The GNU General Public License v3.0](LICENSE).