import mongoose from 'mongoose';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, mkdirSync, readFile, createWriteStream } from 'node:fs';
import archiver from 'archiver';
import * as Discord from 'discord.js';

const promisifiedExec = promisify(exec);

async function createMongoBackup() {
  if (!existsSync(config.database.backup.output_dir)) {
    mkdirSync(config.database.backup.output_dir, { recursive: true });
    logger.warn('Backup directory not found. Creating new directory:', config.database.backup.output_dir);
  }

  const databaseIsReady = mongoose.connection.readyState === mongoose.STATES.connected;
  if (!databaseIsReady) throw new Error('Database connection not established.');

  logger.info('Taking backup of database..');

  const formattedDate = getFormattedDate();
  const backupPath = generateBackupPath(formattedDate);

  if (existsSync(backupPath)) throw new Error('Backup already exists for today.');

  const cmd = generateBackupCommand(process.env.MONGODB_URI, backupPath, config.database.backup.exclude_collections);

  await promisifiedExec(cmd);

  if (config.database.backup.discord_channel) {
    if (!global.client) throw new Error('Discord client not established.');

    const channel = client.channels.cache.get(config.database.backup.discord_channel) as Discord.TextChannel;
    if (!channel) throw new Error('Discord channel not found.');

    const zipBuffer = await createZipBuffer(backupPath);
    const attachment = new Discord.AttachmentBuilder(zipBuffer, { name: `${new Date().toISOString()}.zip` });

    await channel.send({ files: [attachment] });

    logger.info('Database backup sent to Discord channel successfully.');
  }

  logger.info('Database backup taken successfully.');
}

function getFormattedDate() {
  return new Date().toISOString().split('T')?.[0] || 'unknown-date';
}

function generateBackupPath(date: string) {
  return `${config.database.backup.output_dir}/${date}`;
}

function generateBackupCommand(url: string, backupPath: string, exclude_collections: string[]) {
  const collectionsToExclude = exclude_collections.map(collection => `--excludeCollection=${collection}`).join(' ');

  return `mongodump --uri="${url}" --gzip --forceTableScan --quiet --out=${backupPath} ${collectionsToExclude}`;
}

async function createZipBuffer(dirPath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(`${dirPath}.zip`) as unknown as NodeJS.WritableStream;
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      readFile(`${dirPath}.zip`, (error, data) => {
        if (error) reject(error);
        else resolve(data);
      });
    });

    archive.on('error', error => reject(error));
    archive.pipe(output);
    archive.directory(dirPath, false);
    archive.finalize();
  });
}

export default createMongoBackup;