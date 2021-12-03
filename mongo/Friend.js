const { model, Schema } = require('mongoose');

const friendSchema = new Schema({
  requester: String,
  invitee: String,
  status: {
    type: String,
    enum: ['pending', 'active', 'deleted'],
    default: 'pending'
  }
});

module.exports = model('Friend', friendSchema);
