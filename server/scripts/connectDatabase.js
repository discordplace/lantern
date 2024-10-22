const mongoose = require('mongoose');

function connectDatabase(url) {
  mongoose.connect(url, { dbName: 'lantern' })
    .then(() => logger.database('Connected to database.'));
}

module.exports = connectDatabase;