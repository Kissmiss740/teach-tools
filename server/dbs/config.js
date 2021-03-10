//mongodb的配置文件
//mongodb://用户名:密码@服务器主机地址:mongodb运行端口/要连接的数据库名称
const DBS = process.env.NODE_ENV === 'production' ?
  'mongodb://user:user@127.0.0.1:27017/teach_design_platform' :
  'mongodb://127.0.0.1:27017/dbs'
module.exports = {
  //dbs是数据库名称
  dbs: DBS,
  redis: {
    get host() {
      return '127.0.0.1'
    },
    get port() {
      return 6379
    }
  },
  smtp: {
    get host() {
      return 'smtp.qq.com'
    },
    get port() {
      return 465
    },
    get user() {
      return '1120681908@qq.com'
    },
    get pass() {
      return 'rcfhpzzczzbubabi'
    },
    get code() {
      return () => {
        return Math.random().toString(16).slice(2, 6).toUpperCase()
      }
    },
    get expire() {
      return () => {
        return new Date().getTime() + 10 * 60 * 1000
      }
    }
  },

}