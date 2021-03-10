const Koa = require('koa')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')
const file = require('./routes/file')
const users = require('./routes/users')
const post = require('./routes/post')
const session = require('koa-generic-session')
const passport = require('./utils/passport')
const Redis = require('koa-redis')
const path = require('path')
const resolve = (dir) => {
  return path.join(__dirname, dir)
}


const app = new Koa()
// error handler
onerror(app)
app.keys = ['tsp', 'keyskeys']
const session_config = {
  /**  cookie的key。 (默认是 koa:sess) */
  key: 'tsp', //前缀:加在key前面
  prefix: 'tsp:uid',
  /**  session 过期时间，以毫秒ms为单位计算 。*/
  maxAge: 60 * 60 * 1000 * 24 * 7,
  /** 自动提交到响应头。(默认是 true) */
  autoCommit: true,
  /** 是否允许重写 。(默认是 true) */
  overwrite: true,
  /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */
  httpOnly: true,
  /** 是否签名。(默认是 true) */
  signed: true,
  /** 是否每次响应时刷新Session的有效期。(默认是 false) */
  rolling: true,
  /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
  renew: false,
  store: new Redis()
}
app.use(session(session_config))
// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(resolve('public')))
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  let user;
  try {
    if (ctx.isAuthenticated()) {
      user = ctx.session.passport.user.username
    }
  } catch (error) {

  }

  console.log(`${user}:${ctx.method} ${ctx.url} - ${ms}ms`)
})
//跨域
if (process.env.NODE_ENV !== 'production') {
  const cors = require('koa2-cors')
  app.use(cors({
    origin: (ctx) => {
      return 'http://localhost:8080'
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }));

}
app.use(passport.initialize())
app.use(passport.session())
//连接mongodb
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
// routes
const allowPath = ['/users/signup', '/users/signin', '/users/verify']
// 请求拦截
function Interceptor(ctx, next) {
  let url = ctx.request.url
  // 是否在白名单
  if (allowPath.indexOf(url) !== -1) {
    return next()
  }
  // 是否在登陆状态
  if (ctx.isAuthenticated()) {

    return next()
  }
  ctx.status = 401
  ctx.body = {
    code: -1,
    msg: '无权访问。'
  }
}
app.use(async (ctx, next) => {
  await Interceptor(ctx, next)
})
app.use(users.routes(), users.allowedMethods())
app.use(file.routes(), file.allowedMethods())
app.use(post.routes(), post.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app