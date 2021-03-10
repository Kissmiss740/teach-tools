<template>
  <el-container class="wrap">
    <el-header class="fy_el-header"
               height="42px">
      <img src=".././assets/logo.png"
           alt="">
      <span class="logoFont">教学设计辅助平台</span>
      <router-link class="navItem"
                   active-class="active"
                   to="/MyTeachFile">教案中心</router-link>
      <router-link class="navItem"
                   active-class="active"
                   :to="toDesignLink">设计中心</router-link>
      <router-link class="navItem"
                   active-class="active"
                   to="/TeachPost">教案广场</router-link>
      <router-link class="navItem"
                   active-class="active"
                   to="/Article">学习中心</router-link>
      <!-- <el-menu :default-active="activeName"
               mode="horizontal"
               router>
        <el-menu-item index="/MyTeachFile">教案中心</el-menu-item>
        <el-menu-item index="/design">设计中心</el-menu-item>
        <el-menu-item index="/404">教案广场</el-menu-item>
      </el-menu> -->
      <div class="right-nav">
        <el-dropdown @command="handleCommand1">
          <el-button icon="el-icon-plus"
                     class="add-btn"
                     size="mini"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-document-add"
                              command="design">新建空白教案</el-dropdown-item>
            <el-dropdown-item icon="el-icon-document-copy"
                              command="template">新建模板</el-dropdown-item>
            <el-dropdown-item icon="el-icon-document"
                              divided
                              command="createFromTem">从模板中新建教案</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-key"
                              command="modifyPwd">修改密码</el-dropdown-item>
            <el-dropdown-item icon="el-icon-switch-button"
                              command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>

    </el-header>
    <el-container>
      <el-aside width="50px"
                class="nav-outside">
        <el-menu :default-active="activeName"
                 background-color="transparent"
                 text-color="#9aaeba"
                 active-text-color="#9aaeba"
                 router
                 :collapse="true">
          <el-menu-item index="/MyTeachFile">
            <i class="el-icon-notebook-1"></i>
            <span slot="title">教案中心</span>
          </el-menu-item>
          <el-menu-item index="/design">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">设计中心</span>
          </el-menu-item>
          <el-menu-item index="/TeachPost">
            <i class="el-icon-s-help"></i>
            <span slot="title">教案广场</span>
          </el-menu-item>
          <el-menu-item index="/Article">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学习中心</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-dialog title="文件名"
               :visible.sync="createNewFileDialog"
               :show-close="false"
               width="30%">
      <el-input type="text"
                v-model="fileName"
                clearable></el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="cancelCreate">取 消</el-button>
        <el-button type="primary"
                   :disabled="fileName===''"
                   @click="createNewFile">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import { CreateOneFile } from '@/api'
import { create_new_file, init_file } from '@/utils/index'
import { mapMutations, mapActions } from 'vuex'
export default {
  data () {
    let login_name = localStorage.getItem('username')
    return {
      username: login_name || '用户名',
      fileName: '',
      fileType: '',
      activeName: '',
      toDesignLink: '/design/CourseBrief',
      createNewFileDialog: false
    }
  },
  watch: {
    '$route.path': function (newVal) {
      if (newVal.includes('/design')) {
        this.activeName = '/design'
        this.toDesignLink = newVal
      } else {
        this.activeName = newVal
      }
    }
  },
  methods: {
    ...mapMutations([
      'FILENAME',
      'FILETYPE'
    ]),
    ...mapActions(['LogOut']),
    logout: function () {
      this.LogOut().then(() => {
        this.$router.push('/login')
      })
    },
    cancelCreate: function () {
      this.fileName = ''
      this.createNewFileDialog = false
    },
    createNewFile: function () {
      const loading = this.$loading({})
      let name = this.fileName,
        username = this.username,
        type = this.fileType
      const content = init_file()
      create_new_file({ name, type, username, content }).then((id) => {
        this.FILENAME(name)
        this.FILETYPE(type)
        this.cancelCreate()
        this.$router.push({
          name: 'CourseBrief',
          query: {
            id
          }
        }).then(() => {
          loading.close()
        })

      })
    },
    handleCommand1: function (command) {
      if (command === 'createFromTem') {
        this.$router.push({
          name: 'MyTeachFile',
          query: {
            tag: 'template'
          }
        })
      } else {
        this.fileType = command
        this.createNewFileDialog = true
      }
    },
    handleCommand: function (command) {
      switch (command) {
        case 'logout':
          this.logout()
          break;
        case 'modifyPwd':
          this.$alert('该功能尚未完善，敬请期待！', '开发者提示', {
            confirmButtonText: '确定'
          })
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.wrap {
  height: 100%;
  .el-container {
    height: 100%;
  }
  .el-main {
    padding: 0;
  }
  .fy_el-header {
    background: #212528;
    color: #fff;
    z-index: 1000;
    font-size: 14px;
    line-height: 50px;
    padding-left: 5px;
    img {
      height: 36px;
      position: relative;
      top: 4px;
    }
    span.logoFont {
      font-size: 16px;
      margin-left: 20px;
      position: relative;
      top: -9px;
      margin-right: 100px;
    }
    .navItem {
      color: #fff;
      display: inline-block;
      height: 42px;
      line-height: 42px;
      padding: 0 20px;
      position: relative;
      top: -10px;
      text-decoration: none;
      &.active {
        background: hsla(0, 0%, 100%, 0.2);
      }
    }
    .right-nav {
      float: right;
      .add-btn {
        border: none;
        background-color: transparent;
        padding: 5px;
        &:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }
        .el-icon-plus {
          font-size: 25px;
          color: #fff;
        }
      }
      .el-dropdown {
        height: 42px;
        font-size: 18px;
        cursor: pointer;
        &-link {
          color: #fff;
        }
        &:before {
          content: "";
          border-left: 1px solid #fff;
          width: 2px;
          margin: 0px 8px;
        }
      }
    }
  }
  
  .nav-outside {
    background: #21232b;
    overflow-x: hidden;
    .el-menu--collapse {
      width: 50px;
      .el-menu-item {
        padding-left: 0 !important;
        padding: 0px !important;
        height: 48px;
        text-align: center;
        line-height: 48px;
        &:first-child {
          i {
            color: #fff !important;
          }
        }
        &.is-active {
          .el-tooltip {
            background: #121319;
            &::after {
              content: "";
              width: 3px;
              background: #00c1de;
              height: 48px;
              display: block;
              position: absolute;
              top: 0;
            }
          }
        }
        .el-tooltip {
          padding: 0 !important;
        }
      }
    }
  }
  //内部导航栏
  .nav-inside {
    background: #e4e4e4;
    .search {
      height: 40px;
      background-color: #f8f8f8;
      padding: 8px 12px;
      border-bottom: 1px solid #e5e5e5;
      .el-input {
        height: 24px;
        .el-input__inner {
          height: 24px;
        }
      }
      .el-input--small .el-input__icon {
        line-height: 24px;
      }
    }
    .el-menu {
      border-right: none;
      .el-menu-item:hover,
      .el-menu-item:active {
        background-color: #fff !important;
      }
    }
    .el-menu-item.is-active {
      background-color: #fff !important;
    }
  }
  .tabsNav {
    padding: 0;
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border-top: 3px solid #01c1de;
      border-radius: 0;
    }
    .el-tabs--card > .el-tabs__header {
      margin: 0;
    }
    .el-tabs__item.is-active {
      color: #333 !important;
    }
    .el-tabs__item {
      font-size: 12px;
    }
    .el-tabs__item:focus.is-active.is-focus:not(:active) {
      box-shadow: none !important;
    }
    .tool-left {
      float: left;
      width: 100%;
      border-bottom: 1px solid #e4e7ed;
      .el-button {
        &:first-child {
          margin-left: 10px;
        }
        border: none;
        margin-top: 8px;
      }
    }
  }
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.06);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}

::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.12);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}
.el-dropdown-menu__item {
  line-height: 50px;
  font-size: 16px;
  i {
    margin-right: 15px;
    font-size: 20px;
  }
}
</style>
