<template>
  <div class="login-container">
    <el-form ref="loginForm"
             :model="loginForm"
             :rules="loginRules"
             class="login-form"
             auto-complete="on"
             label-position="left">
      <div class="title-container">
        <h1 class="title">
          登 录
          <span>没有账号？<router-link to="/register">点此注册</router-link></span>
        </h1>
      </div>
      <el-form-item prop="username">
        <div class="icon-container">
          <i class="el-icon-user-solid"></i>
        </div>
        <el-input ref="username"
                  v-model="loginForm.username"
                  placeholder="用户名/邮箱"
                  name="username"
                  clearable
                  type="text"
                  tabindex="1"
                  auto-complete="on" />
      </el-form-item>
      <el-form-item prop="password">
        <div class="icon-container">
          <i class="el-icon-lock"></i>
        </div>
        <el-input ref="password"
                  v-model="loginForm.password"
                  type="password"
                  placeholder="密码"
                  clearable
                  name="password"
                  tabindex="2"
                  show-password
                  auto-complete="on"
                  @keyup.enter.native="handleLogin" />
      </el-form-item>
      <el-button :loading="loading"
                 type="primary"
                 style="width:100%;"
                 @click.native.prevent="handleLogin">登 录</el-button>
      <p class="tips"
         v-if="loginErrMsg!==''">
        <i class="el-icon-warning"></i> {{loginErrMsg}}
      </p>
    </el-form>
  </div>
</template>

<script>
const CryptoJS = require('crypto-js')
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名或邮箱' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      loading: false,
      loginErrMsg: ''
    }
  },
  watch: {
  },
  methods: {
    ...mapActions(['LogIn']),
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.LogIn({
            username: this.loginForm.username,
            password: CryptoJS.MD5(this.loginForm.password).toString()
          })
            .then(data => {
              this.$router.push({
                name: 'MyTeachFile'
              })
              this.loginErrMsg = ''
              this.loading = false
            })
            .catch(errMsg => {
              this.loginErrMsg = errMsg
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">


$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 10px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 30px;
    .el-form-item__content {
      .el-form-item__error {
        font-size: 16px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$imgUrl: url("../.././assets/login.png");

.login-container {
  min-height: 100%;
  width: 100%;
  background: center / 100% 100% no-repeat $imgUrl;
  overflow: hidden;
  position: relative;
  .login-form {
    position: absolute;
    width: 450px;
    max-width: 100%;
    overflow: hidden;
    right: 10%;
    top: 25%;
  }

  .tips {
    font-size: 16px;
    color: red;
    margin-top: 10px;
    text-align: center;
  }

  .icon-container {
    padding: 6px 0px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
    font-size: 30px;
  }

  .title-container {
    position: relative;

    .title {
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
      span {
        position: absolute;
        font-size: 16px;
        right: 0;
        bottom: 0;
        a {
          text-decoration: none;
          color: #409eff;
        }
      }
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
