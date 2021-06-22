const { model, Schema } = require('mongoose');

const messageSchema = new Schema({
  to: String,
  from: String,
  content: String,
  createdAt: String
});

module.exports = model('Message', messageSchema);
