<style lang="scss">
.evaluate-wrap {
  height: 100%;
  width: 100%;
  .el-main {
    overflow: hidden;
  }
  .top-half {
    border-bottom: 1px solid #c2c5cb;
    margin-top: 30px;
    .example-content {
      width: 80%;
      margin: 20px auto;
    }
    .evaluate-content {
      .img-box {
        display: flex;
        display: -webkit-flex;
        width: 80%;
        height: 250px;
        padding: 0 30px;
        margin: 0 auto;
        img {
          flex: 1;
        }
      }
    }
  }
  .bottom-half {
    padding-top: 20px;
    .editor-container {
      height: 100%;
      width: 96%;
      margin: 0 auto;
      .upload-container {
        width: 500px;
        margin: 0 auto;
        .el-upload-list__item {
          font-size: 20px;
        }
      }
    }
  }
}
.cellClass:hover {
  background-color: #b5b5b5 !important;
  cursor: pointer;
}

.demand-tag-aside {
  border-left: 1px solid #c2c5cb;
  padding: 20px 20px 0 20px;
  background-color: #ffffff;
  .el-tag {
    width: 160px;
    margin: 10px auto;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
  }
  .chosen-style {
    background-color: #409eff;
    color: #fff;
  }
}
</style>
<template>
  <el-container class="evaluate-wrap">
    <!-- 中间部分 -->
    <el-main>
      <!-- 范例区 -->
      <div class="top-half">
        <!-- 范  例 -->
        <div class="example-content"
             v-if="isExample">
          <p>教师利用试题评价学习者计算思维水平；让学生填写问卷，评价和调查学生对本次课程的学习兴趣，利用量规从主题、艺术、Micro:bit 技术等维度对学生小组合作学习情况进行评价。</p>
        </div>
        <div v-else
             class="evaluate-content">
          <p style="text-indent:2em;">
            {{desc}}
            <el-button type="text"
                       style="text-"
                       @click="isExample=true">返 回</el-button>
          </p>
          <div class="img-box">
            <img :src="imgUrl"
                 width="100%"
                 height="100%">
          </div>
        </div>
      </div>
      <!-- 编辑区 -->
      <div class="bottom-half">
        <!-- 教师编辑区 -->
        <div class="editor-container">

          <el-button @click="drawer=true"
                     type="primary">上传文件</el-button>
          <vue-ueditor-wrap v-model="Content"
                            mode="observer"
                            :observerDebounceTime="observerDebounceTime"
                            :config="config"></vue-ueditor-wrap>
          <el-drawer title="上传文件"
                     :visible.sync="drawer"
                     direction="btt"
                     size="50%"
                     @open.once="handleOpenDrawer"
                     :before-close="handleClose">
            <div class="upload-container">
              <el-upload ref="upload"
                         :action="`${baseUrl}/file/upload`"
                         :on-remove="handleRemove"
                         :on-success="handleSucces"
                         multiple
                         :http-request="uploadFile"
                         accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                         :file-list="fileList"
                         :auto-upload="false">
                <el-button slot="trigger"
                           type="primary">上传文件</el-button>
                <el-button style="margin-left: 50px;"
                           type="success"
                           @click="submitUpload">保存到服务器</el-button>
                <div slot="tip"
                     style="margin-top:18px;"><i>提示：只能上传doc/docx文件，单个不超过500kb</i></div>
                <el-tag v-show="uploadLogo=='1'"
                        style="margin-left:30px;">上传中...</el-tag>
                <el-tag v-show="uploadLogo=='2'"
                        style="margin-left:30px;"
                        type="success">上传成功!</el-tag>
                <el-tag v-show="uploadLogo=='3'"
                        style="margin-left:30px;"
                        type="danger">上传失败!</el-tag>
              </el-upload>
            </div>
          </el-drawer>

        </div>
      </div>
    </el-main>
    <!-- 右侧导航栏 -->
    <el-aside width="200px"
              class="demand-tag-aside">
      <p>教师评价类型示例</p>
      <el-tag :key="tag.id"
              :class="{'chosen-style':tag.id===clickDemandTagIndex}"
              v-for="tag in demandList"
              @click="handleOptionTagClick(tag)">
        {{tag.title}}
      </el-tag>
    </el-aside>
  </el-container>
</template>
<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import config from 'views/editorConfig.js'
import { UpdateModule, UploadFiles, GetEvalFileList } from '@/api'
import TAG_DATA from './data'
import { saveContentToLocal, getContentFromLocal } from 'views/HtmlToWord.js'
export default {
  components: {
    VueUeditorWrap
  },
  data () {
    return {
      name: 'Teach_Evaluate',
      Content: getContentFromLocal('Teach_Evaluate'),
      observerDebounceTime: 1000,
      clickDemandTagIndex: '',
      demandList: TAG_DATA,
      example: '',
      desc: '',
      imgLoading: false,
      isExample: true,
      config: config,
      fileList: [],
      drawer: false,
      uploadLogo: '0',
      fileData: null,
      baseUrl: process.env.NODE_ENV === 'production' ? 'http://39.97.255.236' : 'http://localhost:3000'
    }
  },

  methods: {

    handleOptionTagClick (tag) {
      this.imgLoading = true
      this.clickDemandTagIndex = tag.id
      this.imgUrl = require(`./image/${tag.imgUrl}`)
      this.isExample = false
      this.example = tag.example
      this.desc = tag.desc
      this.imgLoading = false
    },
    uploadFile: function (file) {
      console.log("fileList:", this.fileList)
      this.fileData.append('file', file.file);
    },
    submitUpload () {
      this.fileData = new FormData();
      this.$refs.upload.submit();
      this.uploadLogo = "1";
      let that = this
      let id = localStorage.getItem("file_id")
      UploadFiles({
        fileData: that.fileData,
        id
      })
        .then(() => {
          this.uploadLogo = '2'
        })
        .catch(err => {
          this.uploadLogo = '3'
          console.log(err)
        })
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },

    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    handleSucces: function (response, file, fileList) {
    },
    handleOpenDrawer: function () {
      let id = localStorage.getItem("file_id")
      GetEvalFileList(id).then(data => {
        console.log("file-data:", data)
        this.fileList = data
      })
        .catch(err => {
          console.log("获取文件列表失败：err", err)
        })
    }
  },
  watch: {
    Content (newVal, oldVal) {
      this.$store.commit('SAVED')
      saveContentToLocal(this.name, newVal)
      let id = localStorage.getItem('file_id')
      UpdateModule({
        id,
        module: this.name,
        value: newVal
      }).then(() => {
        setTimeout(() => {
          this.$store.commit('SAVED')
        }, 500);
      }).catch(err => {
        setTimeout(() => {
          this.$store.commit('SAVED')
        }, 500);
      })
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

