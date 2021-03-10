const Router = require('koa-router')
const Redis = require('koa-redis')
const nodeMailer = require('nodemailer')
const UserModel = require('../dbs/models/users')
const Passport = require('../utils/passport')
const Email = require('../dbs/config')

let router = new Router({
  prefix: '/users'
})
let Store = new Redis().client
//注册
router.post('/signup', async (ctx) => {
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body;
  //验证是否填写信息
  if (!username || !password || !email || !code) {
    ctx.body = {
      code: -1,
      msg: '请填写完整的信息'
    }
    return false
  }
  //验证邮箱是否已被注册
  let has_email = await UserModel.findOne({
    email
  })
  if (has_email !== null) {
    ctx.body = {
      code: -1,
      errorInput: 'username',
      msg: '该邮箱已被注册'
    }
    return false
  }
  //验证用户名是否已被注册
  let has_username = await UserModel.findOne({
    username
  })
  if (has_username !== null) {
    ctx.body = {
      code: -1,
      errorInput: 'username',
      msg: '该用户名已被注册'
    }
    return false
  }
  //验证验证号
  if (code) {
    //根据键为nodemail+emial的用户对应的验证码和验证码过期时间
    const saveCode = await Store.hget(`nodemail:${email}`, 'code')
    const saveExpire = await Store.hget(`nodemail:${email}`, 'expire')
    //先检查验证码是否匹配，因为有可能该邮箱就没发送过验证码
    if (code === saveCode) {
      //验证码是否过期
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          errorInput: 'code',
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        errorInput: 'code',
        msg: '验证码错误'
      }
      return false
    }
  } else {
    ctx.body = {
      code: -1,
      errorInput: 'code',
      msg: '请填写验证码'
    }
    return false
  }
  //将该用户写入数据库
  let newUser = await UserModel.create({
    username,
    password,
    email
  })
  //注册成功
  if (newUser) {
    ctx.body = {
      code: 0,
      msg: '注册成功',
      data: {}
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '数据库写入失败'
    }
  }
})
//给用户邮箱发送验证码
router.post('/verify', async (ctx, next) => {
  const email = ctx.request.body.email
  //验证邮箱是否已被注册
  let has_email = await UserModel.findOne({
    email
  })
  if (has_email !== null) {
    ctx.body = {
      code: -1,
      msg: '该邮箱已被注册'
    }
    return false
  }
  const saveExpire = await Store.hget(`nodemail:${email}`, 'expire')
  const isInOneMin = saveExpire ? saveExpire - new Date().getTime() > 9 * 60 * 1000 : false
  if (isInOneMin) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }
    return false
  }
  //发送方信息
  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: Email.smtp.port,
    //secure true则监听465端口,false则监听其他端口
    secure: true,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  //注册者信息
  let receiver = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: email
  }
  let mailOptions = {
    from: `教学设计软件平台<1120681908@qq.com>`,
    to: receiver.email,
    subject: '【验证码】',
    html: `您的验证码为：${receiver.code}（10分钟有效），请勿泄露给他人。
    
    如有问题，请通过邮件联系hanlong.liao@foxmail.com，邮件中请注明个人信息`
  }
  await transporter.sendMail(mailOptions, async (err, info) => {
    if (err) {
      ctx.body = {
        code: -1,
        msg: `邮件发送失败：${err}`
      }
      global.console.log('邮件发送失败：', err)
    } else {
      //将一个准用户的信息缓存到redis
      Store.hmset(`nodemail:${receiver.email}`, 'code', receiver.code, 'expire', receiver.expire)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，有效期10分钟',
    data: {}
  }
})
//登录
router.post('/signin', async (ctx, next) => {
  //假如已经在登录状态就不重复登录
  if (ctx.isAuthenticated()) {
    ctx.body = {
      code: 0,
      msg: '已经登录了',
      data: {}
    }
    return false
  }
  return Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      global.console.log("passport.err:", err)
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登陆成功',
          data: {
            username: user.username,
            email: user.email,
            session: user._id
          }
        }
        //passport中间件自带的登录函数（3x以前为ctx.req.login）
        return ctx.login(user)
      } else {
        global.console.log("passport.info:", info)
        ctx.body = {
          code: -1,
          msg: info
        }
      }
    }
    //【问题】为什么要next?
  })(ctx, next)
})


//退出登录
router.get('/logout', async (ctx, next) => {
  //passport自带的登出函数，会自动cookie的session
  await ctx.logout()
  //检查是否还在登录状态
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0,
      msg: '退出成功',
      data: {}
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '退出失败'
    }
  }
})
//获取用户信息
router.get('/getUserInfo', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const {
      username,
      email
    } = ctx.session.passport.user
    ctx.body = {
      code: 0,
      msg: '获取成功',
      data: {
        username,
        email,
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '未登录'
    }
  }
})
//获取用户收藏、点赞的帖子
router.get('/getUserStarLikePost', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const username = ctx.session.passport.user.username
    let result = await UserModel.findOne({
      username
    })
    if (!result) {
      ctx.body = {
        code: -1,
        msg: ''
      }
      return false
    }
    ctx.body = {
      code: 0,
      msg: '',
      data: {
        StarPosts: result.StarPosts || [],
        LikePosts: result.LikePosts || []
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '未登录'
    }
  }
})

module.exports = router