const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: String,
    required: true
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('User', UserSchema);