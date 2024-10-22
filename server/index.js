const connectDatabase = require('@/scripts/connectDatabase');
connectDatabase(process.env.MONGODB_URI);

const createClient = require('@/lib/bot/createClient');
createClient();

// testing actions