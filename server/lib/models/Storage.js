const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const createUserData = require('@/utils/createUserData');
const { send: socket_send } = require('@/lib/express/routes/socket/utils');

const StorageSchema = new Schema({
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
      validator: function(v) {
        // Ensure that each key is alphanumeric and doesn't exceed 255 characters
        for (let key of v.keys()) {
          if (!/^[a-zA-Z0-9]+$/.test(key) || key.length > 255) {
            return false;
          }
        }

        // Ensure that each value doesn't exceed 30,000 characters
        for (let value of v.values()) {
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

const Model = mongoose.model('KeyValueStorage', StorageSchema);

Model.watch().on('change', async metadata => {
  const { documentKey: { _id }, operationType } = metadata;

  // Do not send a socket message if the token was updated
  if (operationType === 'update') {
    const { updateDescription } = metadata;
    if (updateDescription.updatedFields.token) return;
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

module.exports = Model;