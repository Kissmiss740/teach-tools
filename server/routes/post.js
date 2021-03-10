const PostModel = require('../dbs/models/post')
const UserModel = require('../dbs/models/users')
const FileModel = require('../dbs/models/file')
const Router = require('koa-router')

const router = new Router({
  prefix: '/post'
})
const formatSingleNum = (num) => {
  return num > 9 ? num : `0${num}`
}
const getCurTime = () => {
  let date = new Date()
  let YY = date.getFullYear(),
    MM = date.getMonth() + 1,
    DD = date.getDate(),
    hh = date.getHours(),
    mm = date.getMinutes(),
    ss = date.getSeconds()
  return `${formatSingleNum(YY)}-${formatSingleNum(MM)}-${formatSingleNum(DD)} ${formatSingleNum(hh)}:${formatSingleNum(mm)}:${formatSingleNum(ss)}`
}

// 创建帖子
router.post('/createNewPost', async (ctx) => {
  const {
    fileId,
    author,
    title,
    description
  } = ctx.request.body
  let time = getCurTime()
  let newPost = {
    title,
    description,
    time,
    fileId,
    author
  }
  await PostModel.create(newPost).then(res => {
      ctx.body = {
        code: 0,
        msg: '分享成功！'
      }
    })
    .catch(err => {
      global.console.log("创建新帖子失败：", err)
      ctx.body = {
        code: -1,
        msg: '分享失败！'
      }
      return false
    })

})

// 获取所有帖子列表
router.get('/getAllPosts', async (ctx) => {
  let result = await PostModel.find().sort({
    _id: -1
  })
  if (!result) {
    ctx.body = {
      code: 0,
      msg: '',
      data: []
    }
    return false
  }
  let list = result.map(async item => {
    let doc = Object.assign({}, item._doc)
    doc["postId"] = doc._id
    let file = await FileModel.findById(item.fileId)
    if (!file) {
      global.console.log("找不到该文件Id:", item.fileId)
      return doc
    }
    doc["fileName"] = file.name
    doc["fileType"] = file.type
    return doc
  })
  let data = []
  for (let res of list) {
    data.push(await res)
  }
  ctx.body = {
    code: 0,
    msg: '',
    data: data
  }
})

// 收藏一个帖子
router.post('/collectOnePost', async (ctx) => {
  const {
    username,
    fileId,
    postId
  } = ctx.request.body

})

// 点赞一个帖子
router.get('/likeOnePost', async (ctx) => {
  const postId = ctx.query.postId

})

const handleStar = async (ctx, username, postId, fileId, status) => {
  let msg = status ? '取消收藏' : '收藏';
  await UserModel.findOne({
    username
  }, (err, doc) => {
    if (err) {
      ctx.body = {
        code: -1,
        msg: msg + '失败！'
      }
      global.console.log("没有该用户")
      return false
    }
    if (!doc.StarPosts) {
      doc.StarPosts = []
    }
    if (status) {
      let i = doc.CollectFiles.indexOf(fileId)
      let j = doc.StarPosts.indexOf(postId)
      doc.CollectFiles.splice(i, 1)
      doc.StarPosts.splice(j, 1)
    } else {
      doc.CollectFiles.push(fileId)
      doc.StarPosts.push(postId)
    }
    doc.save()
  })
  await PostModel.findById(postId, (err, doc) => {
    if (err) {
      ctx.body = {
        code: -1,
        msg: msg + '失败！'
      }
      global.console.log("没有找到这个帖子")
      return false
    }
    if (status) doc.star--
    else doc.star++
    doc.save()
  })
  ctx.body = {
    code: 0,
    msg: msg + '成功！'
  }
}
const handleLike = async (ctx, username, postId, status) => {
  let msg = status ? '取消点赞' : '点赞';
  await UserModel.findOne({
    username
  }, (err, doc) => {
    if (err) {
      ctx.body = {
        code: -1,
        msg: msg + '失败！'
      }
      global.console.log("没有该用户")
      return false
    }
    if (!doc.LikePosts) {
      doc.LikePosts = []
    }
    if (status) {
      let j = doc.LikePosts.indexOf(postId)
      doc.LikePosts.splice(j, 1)
    } else {
      doc.LikePosts.push(postId)
    }
    doc.save()
  })
  await PostModel.findById(postId, (err, doc) => {
    if (err) {
      ctx.body = {
        code: -1,
        msg: msg + '失败！'
      }
      global.console.log("没有找到这个帖子")
      return false
    }
    if (status) doc.like--
    else doc.like++
    doc.save()
  })
  ctx.body = {
    code: 0,
    msg: msg + '成功！'
  }
}
router.get('/starOrLikePost', async (ctx) => {
  let {
    username,
    postId,
    fileId,
    type,
    status
  } = ctx.query
  status = status === 'true' ? true : false
  switch (type) {
    case 'star':
      await handleStar(ctx, username, postId, fileId, status)
      break;
    case 'like':
      await handleLike(ctx, username, postId, status)
  }
})

// 添加一个评论
router.post('/addOneComment', async (ctx) => {
  const {
    reviewer,
    postId,
    content
  } = ctx.request.body
  let time = getCurTime()
  let comment = {
    time,
    content,
    reviewer
  }
  await PostModel.findById(postId, (err, doc) => {
    if (err) {
      ctx.body = {
        code: -1,
        msg: '评论失败！'
      }
      global.console.log("评论失败,err:", err)
      return false
    }
    doc.comments.push(comment)
    doc.save((err => {
      if (err) {
        ctx.body = {
          code: -1,
          msg: '评论失败！'
        }
        global.console.log("评论失败,err:", err)
        return false
      }
    }))
  })
  ctx.body = {
    code: 0,
    msg: '评论成功！',
    data: comment
  }
})

module.exports = router