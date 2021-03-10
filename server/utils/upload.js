const Multer = require('koa-multer')
const storage = Multer.diskStorage({
  destination: 'public/uploads/',
  filename: function (req, file, callback) {
    let fileFormat = file.originalname.split('.')
    callback(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})
// 加载配置
const Upload = Multer({
  storage
})
module.exports = Upload