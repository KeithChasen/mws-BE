const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  email: String,
  password: String,
  bio: String,
  age: String,
  occupation: String,
  nickname: String,
  firstname: String,
  lastname: String
});

module.exports = model('User', userSchema);
