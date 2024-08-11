const level = process.env.NODE_ENV === 'development' ? 'info' : 'warn';
logger[level](`Project is running in ${process.env.NODE_ENV} mode.`);

const connectDatabase = require('@/scripts/connectDatabase');
connectDatabase(process.env.MONGODB_URI);

const createClient = require('@/lib/bot/createClient');
createClient();