//person.js就是表的名字
// const mongoose =require('mongoose'
//const/export语句不能使用，因为Node.js虽然已经实现了99%的ES6新特性，
//但是目前还是为支持const/export，如果不用babel转换，就只能用common.js的形式

const mongoose = require('mongoose')
// 建表结构
let presonSchema = new mongoose.Schema({
  //字段
  name: String,
  age: Number
})
module.exports = mongoose.model('Person', presonSchema)