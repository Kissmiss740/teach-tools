<template>
  <div class="register-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      auto-complete="on"
      hide-required-asterisk
      label-position="left"
    >
      <div class="title-container">
        <h1 class="title">
          注 册
          <span>已有账号？<router-link to="/login">点此登录</router-link></span>
        </h1>
      </div>
      <el-form-item prop="email">
        <el-input
          ref="email"
          clearable
          v-model="registerForm.email"
          placeholder="邮箱"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item prop="code"
                    class="code-el-form-item">

        <el-input ref="code"
                  v-model="registerForm.code"
                  placeholder="验证码"
                  clearable
                  class="code-el-input"
                  type="text"></el-input>

        <el-button @click="handleSendMail"
                   round
                   :disabled="sendBtnText!=='获取验证码'"
                   style="float:right;"
                   type="primary">{{sendBtnText}}</el-button>
      </el-form-item> -->
      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="用户名"
          name="username"
          clearable
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          ref="password"
          v-model="registerForm.password"
          type="password"
          placeholder="密码"
          clearable
          name="password"
          tabindex="2"
          show-password
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="cpassword">
        <el-input
          ref="cpassword"
          v-model="registerForm.cpassword"
          type="password"
          placeholder="确认密码"
          clearable
          @keyup.enter.native="handleRegister"
        ></el-input>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%"
        @click.native.prevent="handleRegister"
        >注 册</el-button
      >
      <p class="tips" v-if="registerErrMsg !== ''">
        <i class="el-icon-warning"></i> {{ registerErrMsg }}
      </p>
    </el-form>
  </div>
</template>

<script>
import { Register, SendMail } from "@/api";
import { setInterval, clearInterval } from "timers";
const CryptoJS = require("crypto-js");

export default {
  name: "register",
  data() {
    return {
      registerForm: {
        email: "",
        username: "",
        code: "",
        password: "",
        cpassword: "",
      },
      registerRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" },
        ],
        code: [{ required: true, trigger: "blur", message: "请输入验证码" }],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
        cpassword: [
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.registerForm.password) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: ["blur", "change"],
          },
        ],
      },
      loading: false,
      registerErrMsg: "",
      sendBtnText: "获取验证码",
    };
  },
  watch: {},
  methods: {
    handleSendMail: function () {
      let self = this;
      if (self.timerId) {
        return false;
      }
      this.$refs.registerForm.validateField("email", (errMsg) => {
        if (!errMsg) {
          SendMail({ email: self.registerForm.email }).then((data) => {
            let second = 60;
            this.sendBtnText = `${second--}秒后可重发`;
            self.timerId = setInterval(() => {
              this.sendBtnText = `${second--}秒后可重发`;
              if (second === 0) {
                clearInterval(self.timerId);
                self.timerId = null;
                this.sendBtnText = "获取验证码";
              }
            }, 1000);
          });
        }
      });
    },
    handleRegister: function () {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const { username, email, password } = this.registerForm;
          Register({
            username,
            email,

            password: CryptoJS.MD5(password).toString(),
          })
            .then((data) => {
              this.$router.push({
                name: "login",
              });
              this.registerErrMsg = "";
              this.loading = false;
            })
            .catch((errMsg) => {
              this.registerErrMsg = errMsg;
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
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

.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    

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
  .code-el-form-item {
    border: none;
    background: none;
  }
  .code-el-input {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    width: 60%;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
