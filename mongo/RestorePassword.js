const { model, Schema } = require('mongoose');

const restorePasswordSchema = new Schema({
  userid: String,
  hash: String,
  timestamp: String
});

module.exports = model('RestorePassword', restorePasswordSchema);
