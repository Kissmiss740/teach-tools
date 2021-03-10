const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostSchema = new Schema({
  fileId: String,
  title: String,
  description: String,
  author: String,
  time: {
    type: String,
    default: Date.now()
  },
  like: {
    type: Number,
    default: 0
  },
  star: {
    type: Number,
    default: 0
  },
  comments: {
    type: Array,
    default: []
  }
})
module.exports = mongoose.model('post', PostSchema)