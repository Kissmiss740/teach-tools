const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  MyFiles: [String],
  CollectFiles: [String],
  LikePosts: [String],
  StarPosts: [String]
})
module.exports = mongoose.model('user', UserSchema)