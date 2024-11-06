import mongoose from 'mongoose';
import createUserData from '@/utils/bot/createUserData';
import { send as socket_send } from '@/express/routes/socket/utils';
import { ChangeStreamDocument } from 'mongodb';

const Schema = mongoose.Schema;

const Storage = new Schema({
  userId: {
    type: String,
    required: true
  },
  token: {
    iv: {
      type: String,
      required: true
    },
    encryptedText: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      required: true
    }
  },
  kv: {
    type: Map,
    of: String,
    validate: {
      validator(v: Map<string, string>) {
        // Ensure that each key is alphanumeric and doesn't exceed 255 characters
        for (const key of v.keys()) {
          if (!/^[a-zA-Z0-9]+$/.test(key) || key.length > 255) {
            return false;
          }
        }

        // Ensure that each value doesn't exceed 30,000 characters
        for (const value of v.values()) {
          if (value.length > 30000) {
            return false;
          }
        }

        return true;
      },
      message: () => 'Invalid key-value pair.'
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

export type StorageType = mongoose.InferSchemaType<typeof Storage>;

const Model = mongoose.model('KeyValueStorages', Storage);

Model.watch().on('change', async (metadata: ChangeStreamDocument<StorageType>) => {
  // @ts-expect-error - The _id property is always present
  const { documentKey: { _id }, operationType } = metadata;

  // Do not send a socket message if the token was updated
  if (operationType === 'update') {
    const { updateDescription } = metadata;
    if (updateDescription.updatedFields?.token) return;
  }

  // Find the storage document that was updated
  const foundStorage = await Model.findById(_id).lean();
  if (!foundStorage) return;

  // Send a message to all active sockets that the user's storage has changed
  for (const [, data] of ActiveSockets) {
    if (data.subscribed === 'ALL' || data.subscribed.includes(foundStorage.userId)) {
      socket_send(data.instance, config.server.socket.opcodes.STORAGE_UPDATE, createUserData(foundStorage.userId, foundStorage.kv || {}));
    }
  }
});

export default Model;