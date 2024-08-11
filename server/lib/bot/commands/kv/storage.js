const Discord = require('discord.js');
const Storage = require('@/models/Storage');
const User = require('@/models/User');
const crypto = require('node:crypto');
const dedent = require('dedent');
const getValidationError = require('@/lib/utils/getValidationError');
const { encrypt, decrypt } = require('@/utils/encryption');

module.exports = {
  json: new Discord.SlashCommandBuilder()
    .setName('storage')
    .setDescription('Key-value storage commands.')
    
    .addSubcommandGroup(group => group.setName('create').setDescription('Key-value storage create commands.')
      .addSubcommand(subcommand => subcommand.setName('token').setDescription('Create a new token for your key-value storage.'))
      .addSubcommand(subcommand => subcommand.setName('data').setDescription('Create a new data for your key-value storage.')
        .addStringOption(option => option.setName('key').setDescription('The key for the data.').setRequired(true))
        .addStringOption(option => option.setName('value').setDescription('The value for the data.').setRequired(true))))

    .addSubcommandGroup(group => group.setName('get').setDescription('Key-value storage get commands.')
      .addSubcommand(subcommand => subcommand.setName('token').setDescription('Get the token for your key-value storage.'))
      .addSubcommand(subcommand => subcommand.setName('data').setDescription('Get the data for your key-value storage.')
        .addStringOption(option => option.setName('key').setDescription('The key for the data.').setRequired(true).setAutocomplete(true))))

    .addSubcommandGroup(group => group.setName('update').setDescription('Key-value storage update commands.')
      .addSubcommand(subcommand => subcommand.setName('data').setDescription('Update the data for your key-value storage.')
        .addStringOption(option => option.setName('key').setDescription('The key for the data.').setRequired(true).setAutocomplete(true))
        .addStringOption(option => option.setName('value').setDescription('The new value for the data.').setRequired(true))))

    .addSubcommandGroup(group => group.setName('delete').setDescription('Key-value storage delete commands.')
      .addSubcommand(subcommand => subcommand.setName('data').setDescription('Delete the data for your key-value storage.')
        .addStringOption(option => option.setName('key').setDescription('The key for the data.').setRequired(true).setAutocomplete(true))))

    .addSubcommand(subcommand => subcommand.setName('list').setDescription('List all the data in your key-value storage.'))
    
    .addSubcommand(subcommand => subcommand.setName('reset').setDescription('Reset your key-value storage.')),
  data: {
    'storage create token': {
      execute: {
        command: async interaction => {
          await interaction.deferReply({ ephemeral: interaction.guild ? true : false });

          const user = await User.findOne({ id: interaction.user.id });
          if (!user) return interaction.error('We could not find your user data. This generally means you are not in our Discord server.');

          const cryptoToken = crypto.randomBytes(16).toString('hex');
          const token = Buffer.from(`${interaction.user.id}:${cryptoToken}`).toString('base64');

          const encryptedToken = encrypt(token, process.env.KV_TOKEN_ENCRYPTION_SECRET);

          await Storage.findOneAndUpdate(
            { userId: interaction.user.id },
            { token: encryptedToken },
            { upsert: true }
          );

          return interaction.success(dedent`
            We have created a new token for your key-value storage.
            \`\`\`${token}\`\`\`
            -# Please keep this token safe.
          `);
        }
      }
    },
    'storage create data': {
      execute: {
        command: async interaction => {
          await interaction.deferReply({ ephemeral: interaction.guild ? true : false });

          let storage = await Storage.findOne({ userId: interaction.user.id });
          if (!storage) return interaction.error('We could not find your key-value storage data. Please create a storage first using `/storage create token`.');

          const key = interaction.options.getString('key');
          const value = interaction.options.getString('value');

          if (!storage.kv) storage.kv = new Map();

          storage.kv.set(key, value);

          const validationError = getValidationError(storage);
          if (validationError) return interaction.error(validationError);

          await storage.save();

          return interaction.success(`New key-value pair added to your storage: \`${key}\` -> \`${value}\``);
        }
      }
    },
    'storage get token': {
      execute: {
        command: async interaction => {
          await interaction.deferReply({ ephemeral: interaction.guild ? true : false });

          const storage = await Storage.findOne({ userId: interaction.user.id });
          if (!storage) return interaction.error('We could not find your key-value storage data. Please create a storage first using `/storage create token`.');

          const decryptedToken = decrypt(storage.token, process.env.KV_TOKEN_ENCRYPTION_SECRET);

          return interaction.success(dedent`
            Here is your token for your key-value storage.
            \`\`\`${decryptedToken}\`\`\`
            -# Please keep this token safe.
          `);
        }
      }
    },
    'storage get data': {
      execute: {
        command: async interaction => {
          await interaction.deferReply({ ephemeral: interaction.guild ? true : false });

          const storage = await Storage.findOne({ userId: interaction.user.id });
          if (!storage) return interaction.error('We could not find your key-value storage data. Please create a storage first using `/storage create token`.');

          const key = interaction.options.getString('key');
          const value = storage.kv.get(key);

          if (!value) return interaction.error(`We could not find the data for the key \`${key}\`.`);

          return interaction.success(`Here is the data for the key \`${key}\`: \`${value}\``);
        },
        autocomplete: async interaction => {
          const storage = await Storage.findOne({ userId: interaction.user.id });
          if (!storage) return interaction.respondAutocomplete([]);

          const keys = [...storage.kv.keys()];

          return interaction.respondAutocomplete(keys.map(key => ({ name: key, value: key })));
        }
      }
    },
    'storage update data': {
      execute: {
        command: async interaction => {
          await interaction.deferReply({ ephemeral: interaction.guild ? true : false });

          const storage = await Storage.findOne({ userId: interaction.user.id });
          if (!storage) return interaction.error('We could not find your key-value storage data. Please create a storage first using `/storage create token`.');

          const key = interaction.options.getString('key');
          const value = interaction.options.getString('value');

          storage.kv.set(key, value);

          const validationError = getValidationError(storage);
          if (validationError) return interaction.error(validationError);

          await storage.save();

          return interaction.success(`Data for the key \`${key}\` updated to \`${value}\`.`);
        }
      }
    },
    'storage delete data': {
      execute: {
        command: async interaction => {
          await interaction.deferReply({ ephemeral: interaction.guild ? true : false });

          const storage = await Storage.findOne({ userId: interaction.user.id });
          if (!storage) return interaction.error('We could not find your key-value storage data. Please create a storage first using `/storage create token`.');

          const key = interaction.options.getString('key');

          storage.kv.delete(key);

          if (!storage.kv.size) delete storage.kv;

          await storage.save();

          return interaction.success(`Data for the key \`${key}\` deleted.`);
        },
        autocomplete: async interaction => {
          const storage = await Storage.findOne({ userId: interaction.user.id });
          if (!storage) return interaction.respondAutocomplete([]);

          const keys = [...storage.kv.keys()];

          return interaction.respondAutocomplete(keys.map(key => ({ name: key, value: key })));
        }
      }
    },
    'storage list': {
      execute: {
        command: async interaction => {
          await interaction.deferReply({ ephemeral: interaction.guild ? true : false });

          const storage = await Storage.findOne({ userId: interaction.user.id });
          if (!storage) return interaction.error('We could not find your key-value storage data. Please create a storage first using `/storage create token`.');

          if (!storage.kv.size) return interaction.error('There is no data in your key-value storage.');

          const data = [...storage.kv.entries()]
            .map(([key, value]) => `"${key}": "${value.replace(/"/g, '\\"')}"`)
            .join(',\n  ');
          
          // If the data is too long, send it as a file
          if (data.length > 1800) {
            const buffer = Buffer.from(`{\n  ${data}\n}`, 'utf-8');

            const attachment = new Discord.AttachmentBuilder(buffer, { name: 'kv-storage.json' });

            return interaction.followUp({ content: 'Here is the list of all the data in your key-value storage:', files: [attachment] });
          } else {
            return interaction.success(`Here is the list of all the data in your key-value storage:\n\`\`\`json\n{\n  ${data}\n}\n\`\`\``);
          }
        }
      }
    },
    'storage reset': {
      execute: {
        command: async interaction => {
          await interaction.deferReply({ ephemeral: interaction.guild ? true : false });

          const storage = await Storage.findOne({ userId: interaction.user.id });
          if (!storage) return interaction.error('We could not find your key-value storage data. Please create a storage first using `/storage create token`.');

          delete storage.kv;

          await storage.save();

          return interaction.success('Your key-value storage has been reset.');
        }
      }
    }
  }
};