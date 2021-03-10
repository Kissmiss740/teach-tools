const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const UserModel = require('../dbs/models/users')
//用户名密码验证策略
passport.use(new LocalStrategy({
    usernameField: 'username'
  },
  /**
   * 
   * @param {string} username 用户输入的用户名，该参数名必须和前端传过来的一致
   * @param {string} password 用户输入的密码，该参数名必须和前端传过来的一致
   * @param {function} done 验证完成之后的回调函数，由passport调用
   */
  async function (username, password, done) {
    //支持用户名或邮箱登录
    let criteria = (username.indexOf('@') === -1) ? {
      username: username
    } : {
      email: username
    };
    let result = await UserModel.findOne(criteria)
    //假如数据库有这个用户
    if (result != null) {
      //密码正确
      if (result.password === password) {
        return done(null, result)
      } else {
        return done(null, false, '密码错误')
      }
    } else {
      return done(null, false, '用户名或邮箱不存在')
    }
  }))
//序列化，登录成功之后把用户的信息保存到session中
passport.serializeUser(function (user, done) {
  done(null, user)
})
//反序列化，每次请求的时候将从session中读取用户的信息
passport.deserializeUser(function (user, done) {
  return done(null, user)
})
module.exports = passport