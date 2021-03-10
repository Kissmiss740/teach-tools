<style lang="scss">
.tool-left {
  position: relative;
  .fileType-text {
    position: absolute;
    color: #606266;
    font: 12px Arial;
    bottom: 0;
    right: 10px;
  }
}
</style>

<template>
  <el-container>
    <!-- 菜单栏 -->
    <el-aside width="15%"
              class="nav-inside">
      <div class="search">
        <el-input placeholder="搜索"
                  size="small"
                  v-model="filterText">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <el-menu :default-active="activeName"
               class="menu"
               router
               background-color="#E4E4E4">
        <el-menu-item index="/design/CourseBrief">
          <i class="el-icon-document"></i>
          <span slot="title">课程简介
          </span>
        </el-menu-item>
        <el-menu-item index="/design/AcademicAnalysis">
          <i class="el-icon-data-analysis"></i>
          <span slot="title">学情分析
          </span>
        </el-menu-item>
        <el-menu-item index="/design/TeachDemand">
          <i class="el-icon-s-flag"></i>
          <span slot="title">教学目标
          </span>
        </el-menu-item>
        <el-menu-item index="/design/TeachHard">
          <i class="el-icon-question"></i>
          <span slot="title">教学重难点
          </span>
        </el-menu-item>
        <el-menu-item index="/design/TeachEnv">
          <i class="el-icon-s-claim"></i>
          <span slot="title">教学环境
          </span>
        </el-menu-item>

        <el-submenu index="/design/TeachFlow">
          <template slot="title">
            <i class="el-icon-s-promotion"></i>
            <span>教学流程</span>
          </template>
          <el-menu-item index="/design/TeachFlow">PBL</el-menu-item>

        </el-submenu>

        <el-submenu index="/design/TeachEvaluate">
          <template slot="title">
            <i class="el-icon-edit-outline"></i>
            <span>教学评价</span>
          </template>
          <el-menu-item index="/design/TeachEvaluate">教师评价</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 工作区 -->
    <el-main>
      <el-container>
        <el-header height="auto"
                   class="tabsNav">
          <el-tabs value="first"
                   type="card">
            <el-tab-pane name="first">
              <span slot="label"><i class="el-icon-s-promotion"></i> {{fileName}}</span>
            </el-tab-pane>
          </el-tabs>
          <div class="tool-left">
            <el-button icon="el-icon-success"
                       :loading="!isSaved"
                       round
                       size="small">{{isSaved?`已保存`:`保存中...`}}</el-button>
            <el-button icon="el-icon-video-play"
                       @click="exportWord"
                       round
                       :loading="exportLoading"
                       :disabled="isExportDisable"
                       size="small">导出word</el-button>
            <el-button icon="el-icon-refresh"
                       @click="reset"
                       round
                       size="small">全部清空</el-button>
            <el-button icon="el-icon-folder-add"
                       @click="changeType"
                       round
                       :loading="changeTypeLoading"
                       size="small">
              {{`另存为${fileType==='template'?'教案':'模板'}`}}
            </el-button>
            <span class="fileType-text">
              {{`当前文件类型：${fileType==='template'?'模板':'教案'}`}}
            </span>
          </div>

        </el-header>
        <el-main style="background-color:#f4f4f4;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script>
import { download_word, init_file } from '@/utils/index'
import { ChangeFileType } from '@/api'
export default {
  name: 'Layout',
  data () {
    return {
      filterText: '',
      activeName: '',
      isExportDisable: false,
      exportLoading: false,
      changeTypeLoading: false
    }
  },
  watch: {
    filterText (val) {
    },

  },
  computed: {
    isSaved () {
      return this.$store.state.isSaved
    },
    fileName () {
      return this.$store.state.fileName
    },
    fileType () {
      return this.$store.state.fileType
    }
  },
  methods: {
    exportWord: function () {
      let fileName = localStorage.getItem('file_name')
      let content = localStorage.getItem('content')
      let hardEnv = localStorage.getItem('Teach_Hard_Env')
      let softEnv = localStorage.getItem('Teach_Soft_Env')
      download_word(content, fileName, hardEnv, softEnv)
    },
    reset: function () {
      this.$confirm('全部清空之后，将无法保留所有编辑，确定清空？', '提示')
        .then(() => {
          init_file()
          window.location.reload()
        })
    },
    changeType: function () {
      this.changeTypeLoading = true
      let id = localStorage.getItem('file_id'),
        type = this.fileType
      ChangeFileType({ id, type })
        .then(() => {
          this.changeTypeLoading = false
        })
        .catch(err => {
          console.log(err)
          this.changeTypeLoading = false
        })
    }
  },
  mounted () {
    this.activeName = this.$route.path
  }
}
</script>