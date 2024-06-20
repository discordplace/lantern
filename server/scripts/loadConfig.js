const fs = require('node:fs');
const path = require('node:path');
const toml = require('@iarna/toml');

const configPath = path.resolve(__dirname, '../config.toml');

const config = toml.parse(fs.readFileSync(configPath, 'utf-8'));

global.config = config;