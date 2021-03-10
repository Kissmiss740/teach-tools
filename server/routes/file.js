const Router = require('koa-router')
const FileModel = require('../dbs/models/file')
const UserModel = require('../dbs/models/users')
const Upload = require('../utils/upload')
const router = new Router({
  prefix: '/file'
})
// 获取用户的文件列表
router.get('/getFileList', async (ctx) => {
  const username = ctx.query.username
  let result = await UserModel.findOne({
    username
  })
  if (!result) {
    ctx.body = {
      code: -1,
      msg: '用户名不存在'
    }
    return false
  }
  let {
    MyFiles,
    CollectFiles
  } = result

  let list1 = MyFiles.map(async id => {
    let file = await FileModel.findById(id)
    return {
      id,
      name: file.name,
      type: file.type
    }
  })
  let list2 = CollectFiles.map(async id => {
    let file = await FileModel.findById(id)
    return {
      id,
      name: file.name,
      type: 'collect'
    }
  })
  let list = []
  for (let res of list1) {
    list.push(await res)
  }
  for (let res of list2) {
    list.push(await res)
  }
  ctx.body = {
    code: 0,
    msg: '',
    data: list
  }
})
// 新建教案/模板
router.post('/addFile', async (ctx) => {
  const {
    name,
    type,
    username,
    content
  } = ctx.request.body
  let newFile = {
    name,
    type,
    content
  }
  let file_id
  await FileModel.create(newFile)
    .then(file => {
      file_id = file._id
      UserModel.findOne({
        username
      }, (err, doc) => {
        if (err) {
          ctx.body = {
            code: -1,
            msg: '未查找到该用户名'
          }
          return false
        }
        doc.MyFiles = [...doc.MyFiles, file_id]
        doc.save((err) => {
          if (err) {
            ctx.body = {
              code: -1,
              msg: '用户新建失败'
            }
            return false
          }
        })
      })
    })
    .catch(err => {
      global.console.log(err)
    })
  ctx.body = {
    code: 0,
    msg: '新建成功！',
    data: {
      id: file_id
    }
  }
})

// 另存为模板/教案
router.get('/changeType', async (ctx) => {
  const {
    id,
    type
  } = ctx.query
  let newType = type === 'design' ? 'template' : 'design'
  await FileModel.findByIdAndUpdate(
    id, {
      $set: {
        type: newType
      }
    },
    (err) => {
      if (err) {
        ctx.body = {
          code: -1,
          msg: '文件类型修改失败'
        }
      }
      return false
    })
  ctx.body = {
    code: 0,
    msg: '修改成功！'
  }
})

//删除教案
router.post('/delFile', async (ctx) => {

})

// 修改教案某一模块
router.post('/updateFile', async (ctx) => {
  const {
    id,
    module,
    value
  } = ctx.request.body

  await FileModel.findById(id, (err, doc) => {
    if (err) {
      global.console.log('未找到该教案')
    }
    doc.content[module] = value
    doc.save(err => {
      if (err) {
        ctx.body = {
          code: -1,
          msg: `${module}修改失败`
        }
        return false
      }
    })
  })
  ctx.body = {
    code: 0,
    msg: ''
  }
})

// 获取某一教案
router.get('/getFile', async (ctx) => {
  // if (!ctx.isAuthenticated()) {
  //   ctx.body = {
  //     code: -1,
  //     msg: '未登录，请去登录。'
  //   }
  //   return false
  // }
  const id = ctx.query.id
  if (!id) {
    ctx.body = {
      code: -1,
      msg: '获取文件信息失败，文件id不能为空！'
    }
    return false
  }
  let result = await FileModel.findById(id)
  if (!result) {
    ctx.body = {
      code: -1,
      msg: '没有此文件！'
    }
    return false
  }
  ctx.body = {
    code: 0,
    msg: '',
    data: {
      name: result.name,
      type: result.type,
      content: result.content
    }
  }
})

// 重命名
router.post('/renameFile', async (ctx) => {
  const {
    id,
    name
  } = ctx.request.body
  await FileModel.findByIdAndUpdate(
    id, {
      $set: {
        name: name
      }
    },
    (err, doc) => {
      if (err) {
        ctx.body = {
          code: -1,
          msg: '重命名失败！'
        }
        return false
      }
    }
  )
  ctx.body = {
    code: 0,
    msg: '重命名成功！'
  }
})

// 文件上传
router.post('/upload', Upload.array('file'), async (ctx) => {
  let fileList = ctx.req.files.map(file => {
    return `${file.filename},${file.originalname}`
  })
  const id = ctx.query.id
  if (!id) {
    ctx.body = {
      code: -1,
      msg: ''
    }
    return false
  }
  await FileModel.findById(id, (err, doc) => {
    if (err) {
      global.console.log("没有找到该文件id，error:", err)
    }
    let EvalFiles = doc.EvaluateFiles
    if (EvalFiles) {
      doc.EvaluateFiles = EvalFiles.concat(fileList)
    } else {
      doc.EvaluateFiles = []
    }
    doc.save()
  })
  ctx.body = {
    code: 0,
    msg: '保存成功！'
  }
})

// 获取某一教案的教学评价文件列表
router.get('/getEvalFiles', async (ctx) => {
  const id = ctx.query.id
  let result = await FileModel.findById(id)
  if (!result) {
    ctx.body = {
      code: -1,
      msg: ''
    }
    global.console.log("没有找到该文件id")
    return false
  }
  let EvaluateFiles = result.EvaluateFiles
  let list
  if (EvaluateFiles) {
    list = EvaluateFiles.map(path => {
      let file = path.split(',')
      return {
        url: file[0],
        name: file[1]
      }
    })
  } else {
    list = []
  }

  ctx.body = {
    code: 0,
    msg: '',
    data: list
  }
})

module.exports = router