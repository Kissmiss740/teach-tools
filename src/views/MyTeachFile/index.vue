<style lang="scss">
.template-tabs-container {
  margin-top: 50px;
  height: 100%;
  background-color: #ffffff;
  .el-tabs__nav-scroll {
    display: flex;
    justify-content: center;
    background-color: #e9e9e9;
    .el-tabs__nav .is-top {
      background-color: #ffffff;
    }
  }
  .template-item-wrap {
    width: 88%;
    margin: 0 auto;
    padding-top: 30px;
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
  }
}
.create-tip {
  width: 400px;
  margin: 40px auto;
  background-color: rgb(248, 249, 250);
  .el-card__body {
    padding: 30px;
  }
  .create-tip-container {
    .create-tip-text {
      display: inline-block;
      margin-left: 18px;
      h3 {
        margin: 10px 0;
      }
      p {
        margin: 0;
      }
    }
  }
  .el-button {
    margin-top: 12px;
    display: block;
    width: 100%;
  }
}
</style>
<template>
  <div style="overflow:hidden;background-color:#e9e9e9;">
    <div class="template-tabs-container">
      <el-tabs v-model="activeName"
               type="card"
               @tab-click="handleClick">
        <el-tab-pane label="我的教案"
                     name="design">
          <keep-alive>
            <div class="template-item-wrap"
                 @click="handleCommand(designFileList,$event)">
              <template-item v-for="(file,index) in designFileList"
                             :key="file.id"
                             :index="index"
                             :imgUrl="IMG_DATA[index%4]"
                             :fileId="file.id"
                             :fileName="file.name"></template-item>
            </div>
          </keep-alive>
          <el-card shadow="always"
                   class="create-tip"
                   v-if="designFileList.length===0">
            <div class="create-tip-container">
              <span>
                <svg t="1587780228249"
                     class="icon"
                     viewBox="0 0 1024 1024"
                     version="1.1"
                     xmlns="http://www.w3.org/2000/svg"
                     p-id="5218"
                     width="60"
                     height="60">
                  <path d="M825.152 614.272c18.048 0 33.216 15.168 33.216 34.304v340.032c0 18.56-14.656 34.304-33.216 34.304a33.472 33.472 0 0 1-33.152-34.304v-340.608c0-18.56 15.168-33.728 33.152-33.728zM231.68 205.696H627.2c17.92 0 33.152 15.104 33.152 34.304 0 18.56-14.656 34.24-33.216 34.24H231.68a33.792 33.792 0 0 1-33.152-34.24c0.512-19.2 15.168-34.304 33.152-34.304z m0 204.032H627.2c17.92 0 33.152 15.104 33.152 34.24 0 19.2-14.656 34.304-33.216 34.304H231.68a33.792 33.792 0 0 1-33.152-34.304c0-19.2 15.168-34.24 33.152-34.24z m0 204.544h230.656c17.984 0 33.152 15.168 33.152 34.304 0 19.2-14.592 34.304-33.152 34.304H231.68a33.792 33.792 0 0 1-33.152-34.304c0-19.2 15.168-34.304 33.152-34.304z"
                        fill="#1296db"
                        p-id="5219"></path>
                  <path d="M660.352 784.64h329.6c18.048 0 33.28 15.104 33.28 34.24 0 19.2-14.72 34.304-33.28 34.304h-329.6a33.792 33.792 0 0 1-33.216-34.304c0-19.2 15.232-34.304 33.216-34.304z"
                        fill="#1296db"
                        p-id="5220"></path>
                  <path d="M726.144 1.088H132.672C60.16 1.088 1.024 62.08 1.024 137.088V886.4c0 74.944 59.072 136 131.648 136h428.672v-68.032H132.672c-36.544 0-65.792-30.208-65.792-67.968V137.088c0-37.76 29.248-68.032 65.792-68.032h593.472c36.608 0 65.856 30.272 65.856 68.032v408.64h65.792V137.088C858.368 62.144 799.36 1.088 726.144 1.088z"
                        fill="#1296db"
                        p-id="5221"></path>
                </svg>
              </span>
              <div class="create-tip-text">
                <h3>新建教案</h3>
                <p>教案是教学工作的重要部分</p>
                <p>您还没有一个教案，去新建一个吧~</p>
              </div>
            </div>
            <el-button type="primary"
                       @click="createNewDesign">新建教案</el-button>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="模板"
                     name="template">
          <div class="template-item-wrap"
               @click="handleCommand(templateFileList,$event)">
            <template-item v-for="(file,index) in templateFileList"
                           :key="file.id"
                           :fileId="file.id"
                           :imgUrl="IMG_DATA[index%4]"
                           :index="index"
                           :fileName="file.name"></template-item>
          </div>
          <el-card shadow="always"
                   class="create-tip"
                   v-if="templateFileList.length===0">
            <div class="create-tip-container">
              <span>
                <svg t="1587783058096"
                     class="icon"
                     viewBox="0 0 1024 1024"
                     version="1.1"
                     xmlns="http://www.w3.org/2000/svg"
                     p-id="7101"
                     id="mx_n_1587783058097"
                     width="60"
                     height="60">
                  <path d="M0 0m146.285714 0l731.428572 0q146.285714 0 146.285714 146.285714l0 731.428572q0 146.285714-146.285714 146.285714l-731.428572 0q-146.285714 0-146.285714-146.285714l0-731.428572q0-146.285714 146.285714-146.285714Z"
                        fill="#67C23A"
                        p-id="7102"
                        data-spm-anchor-id="a313x.7781069.0.i12"
                        class="selected"></path>
                  <path d="M475.428571 475.428571V219.428571a36.571429 36.571429 0 0 1 73.142858 0v256H804.571429a36.571429 36.571429 0 1 1 0 73.142858H548.571429V804.571429a36.571429 36.571429 0 1 1-73.142858 0V548.571429H219.428571a36.571429 36.571429 0 0 1 0-73.142858h256z"
                        fill="#FFFFFF"
                        p-id="7103"></path>
                </svg>
              </span>
              <div class="create-tip-text">
                <h3>新建模板</h3>
                <p>模板可以重复使用</p>
                <p>您还没有一个模板，去新建一个吧~</p>
              </div>
            </div>
            <el-button type="success"
                       @click="createNewTemplate">新建模板</el-button>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="收藏"
                     name="collect">
          <div class="template-item-wrap"
               @click="handleCommand(collectFileList,$event)">
            <template-item v-for="(file,index) in collectFileList"
                           :key="file.id"
                           :index="index"
                           :imgUrl="IMG_DATA[index%4]"
                           :fileId="file.id"
                           :fileName="file.name"></template-item>
          </div>
          <el-card shadow="always"
                   class="create-tip"
                   v-if="collectFileList.length===0">
            <div class="create-tip-container">
              <span>
                <svg t="1587783622518"
                     class="icon"
                     viewBox="0 0 1024 1024"
                     version="1.1"
                     xmlns="http://www.w3.org/2000/svg"
                     p-id="8109"
                     data-spm-anchor-id="a313x.7781069.0.i19"
                     width="60"
                     height="60">
                  <path d="M767.789762 988.960307a70.920339 70.920339 0 0 1-32.516836-8.970162l-224.254037-116.051464-224.254038 116.051464a66.154941 66.154941 0 0 1-72.04161-5.326033 75.125103 75.125103 0 0 1-28.031755-71.480975l46.252396-250.32357-174.91815-171.834656a80.451136 80.451136 0 0 1-19.061593-74.844785 69.238434 69.238434 0 0 1 56.06351-50.176841l245.838488-46.532713 109.604161-232.383247a70.079387 70.079387 0 0 1 62.230496-41.206679 67.556529 67.556529 0 0 1 61.66986 41.206679l110.164796 232.383247 245.558172 44.57049a67.276211 67.276211 0 0 1 56.063509 50.176841 74.844785 74.844785 0 0 1-17.09937 75.125103l-176.880373 173.516561 44.57049 250.32357a73.723515 73.723515 0 0 1-28.031754 71.480975 58.30605 58.30605 0 0 1-39.524774 14.296195z"
                        fill="#F56C6C"
                        p-id="8110"
                        data-spm-anchor-id="a313x.7781069.0.i17"
                        class="selected"></path>
                  <path d="M770.31262 1024h-3.644128a107.922256 107.922256 0 0 1-48.214618-13.174925l-206.594033-107.641938-208.836572 107.922256a101.194635 101.194635 0 0 1-109.604161-8.409527 112.127019 112.127019 0 0 1-40.646045-105.399397l42.888585-233.2242L32.236518 505.412538a115.771147 115.771147 0 0 1-28.031755-108.763209 104.558445 104.558445 0 0 1 84.095264-76.246373l226.776896-42.888584 102.315905-216.405147a105.960033 105.960033 0 0 1 93.065425-61.109225 103.437175 103.437175 0 0 1 94.747331 62.230495l101.75527 215.283877 227.898166 41.206679a101.75527 101.75527 0 0 1 84.095264 75.966055 108.482891 108.482891 0 0 1-25.789214 107.922256l-165.107036 161.462907 41.486997 232.102929a108.482891 108.482891 0 0 1-40.646044 105.399398 92.504791 92.504791 0 0 1-57.745415 21.584451zM768.070079 953.920613a24.107309 24.107309 0 0 0 16.258418-5.886668 39.805092 39.805092 0 0 0 15.697783-38.683822l-47.934301-268.54421 190.055297-186.691487a38.403504 38.403504 0 0 0 8.409527-38.964139 32.797153 32.797153 0 0 0-28.031755-26.349849l-264.339447-47.934301-117.453052-248.921982a33.638106 33.638106 0 0 0-30.554613-21.023816 35.039693 35.039693 0 0 0-29.993978 20.463181l-117.733369 249.2023-263.218177 49.896523a34.479058 34.479058 0 0 0-28.031755 24.948262 44.57049 44.57049 0 0 0 10.932384 41.767315l188.934027 183.607993-49.616206 268.824528a40.085409 40.085409 0 0 0 14.85683 37.562551 31.115248 31.115248 0 0 0 33.357788 2.24254l241.914044-125.021626 239.671503 124.460991a36.441281 36.441281 0 0 0 16.819052 5.045716z"
                        fill="#F56C6C"
                        p-id="8111"
                        data-spm-anchor-id="a313x.7781069.0.i18"
                        class="selected"></path>
                </svg>
              </span>
              <div class="create-tip-text">
                <h3>收藏夹</h3>
                <p>收藏优秀的教案，方便借鉴</p>
                <p>收藏夹空空如也，去广场看一看吧~</p>
              </div>
            </div>
            <el-button type="danger"
                       @click="goTeachPublic">前往教案广场</el-button>
          </el-card>
        </el-tab-pane>
      </el-tabs>
      <el-dialog title="重命名-文件名"
                 :visible.sync="renameDialogVisible"
                 width="30%">
        <el-input type="text"
                  v-model="changeName"
                  ref="renameInput"
                  @focus="focus($event)"
                  clearable>{{initChangeName}}</el-input>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="renameDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     :disabled="changeName===initChangeName||changeName===''"
                     :loading="renameBtnLoading"
                     @click="handleRename">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :title="`新建${fileType==='design'?'教案':'模板'}-文件名`"
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
      <el-dialog title="分享到教案广场"
                 :visible.sync="shareFileDialog"
                 :show-close="false"
                 :close-on-click-modal="false"
                 width="30%">
        <el-input v-model="shareTitle"
                  placeholder="请输入分享的标题"
                  maxlength="10"
                  show-word-limit
                  clearable>
        </el-input>
        <el-input type="textarea"
                  placeholder="请输入分享的理由或对教案的简要说明"
                  v-model="shareDesc"
                  maxlength="200"
                  style="margin-top:30px;"
                  show-word-limit>
        </el-input>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="cancelShare">取 消</el-button>
          <el-button type="primary"
                     :disabled="!shareTitle || !shareDesc"
                     @click="share">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import TemplateItem from './component/TemplateItem.vue'
import { RenameFile, GetOneFile, ShareFile, GetFileList, CreateNewPost } from '@/api'
import { download_word, create_new_file, init_file } from '@/utils/index'
import { mapMutations } from 'vuex'
const IMG_1 = require('@/assets/myFile/blue.png')
const IMG_2 = require('@/assets/myFile/green.png')
const IMG_3 = require('@/assets/myFile/orange.png')
const IMG_4 = require('@/assets/myFile/purple.png')
export default {
  components: {
    TemplateItem
  },
  data () {
    return {
      designFileList: [],
      templateFileList: [],
      collectFileList: [],
      activeName: 'design',
      renameDialogVisible: false,
      initChangeName: '',
      changeName: '',
      renameBtnLoading: false,
      curList: null,
      curId: '',
      curIndex: '',
      fileName: '',
      fileType: '',
      IMG_DATA: [IMG_1, IMG_2, IMG_3, IMG_4],
      createNewFileDialog: false,
      shareFileDialog: false,
      shareTitle: '',
      shareDesc: ''
    };
  },
  watch: {
    '$route.query': function (newVal, oldVal) {
      this.activeName = newVal.tag || 'design'
    }
  },

  created () {
    this.init()
    let tag = this.$route.query['tag']
    if (tag) {
      this.activeName = tag
    }
  },
  methods: {
    ...mapMutations([
      'FILENAME',
      'FILETYPE'
    ]),
    handleClick (tab, event) {
      //
    },
    init: function () {
      let username = localStorage.getItem('username')
      GetFileList(username).then(data => {
        data.forEach(file => {
          switch (file.type) {
            case 'design':
              this.designFileList.push(file)
              break;
            case 'template':
              this.templateFileList.push(file)
              break;
            case 'collect':
              this.collectFileList.push(file)
              break;
          }
        })
      })
    },
    open: function (id) {
      const loading = this.$loading({})
      GetOneFile(id)
        .then(data => {
          const { name, content, type } = data
          localStorage.setItem('file_id', id)
          this.FILENAME(name)
          this.FILETYPE(type)
          localStorage.setItem('content', JSON.stringify(content))
          this.$router.push({
            name: 'CourseBrief',
            query: {
              id
            }
          })
            .then(() => {
              loading.close()
            })
        })
        .catch(() => {
          loading.close()
        })
    },
    cancelShare: function () {
      this.shareFileDialog = false
      this.shareTitle = ''
      this.shareDesc = ''
    },
    share: function () {
      let username = localStorage.getItem('username')
      let id = this.curId
      CreateNewPost({
        fileId: id,
        author: username,
        title: this.shareTitle,
        description: this.shareDesc
      })
        .finally(() => {
          this.shareFileDialog = false
          this.shareTitle = ''
          this.shareDesc = ''
        })
    },
    rename: function (id, list, index) {
      this.curList = list
      this.curId = id
      this.curIndex = index
      this.initChangeName = list[index]["name"]
      this.changeName = this.initChangeName
      this.renameDialogVisible = true
      this.$nextTick(() => {
        this.$refs["renameInput"].select()
      })
    },
    focus: function (ev) {
      ev.currentTarget.select()
    },
    handleRename: function () {
      this.renameBtnLoading = true
      let name = this.changeName
      let index = this.curIndex
      let id = this.curId
      //
      RenameFile({ id, name })
        .then(() => {
          this.initChangeName = ''
          this.changeName = ''
          this.$set(this.curList, index, { id, name })
          this.curList = null
          this.renameBtnLoading = false
          this.renameDialogVisible = false
        })
        .catch(() => {
          this.renameBtnLoading = false
          this.renameDialogVisible = false

        })
    },
    download: function (id) {
      GetOneFile(id)
        .then(data => {
          const { name, content, type } = data
          const { Teach_Hard_Env, Teach_Soft_Env } = content
          download_word(content, name, Teach_Hard_Env, Teach_Soft_Env)
        })
    },
    handleCommand: function (list, ev) {
      let { id, index } = ev.target.dataset
      let title = ev.target.title
      switch (title) {
        case '打开':
          this.open(id);
          break;
        case '分享':
          this.curId = id
          this.shareFileDialog = true
          break;
        case '重命名':
          this.rename(id, list, index)
          break;
        case '下载':
          this.download(id)
          break;
      }
    },
    cancelCreate: function () {
      this.createNewFileDialog = false
      this.fileName = ''
    },
    createNewDesign: function () {
      this.fileType = 'design'
      this.createNewFileDialog = true
    },
    createNewTemplate: function () {
      this.fileType = 'template'
      this.createNewFileDialog = true
    },
    createNewFile: function () {
      const loading = this.$loading({})
      let name = this.fileName,
        username = localStorage.getItem('username'),
        type = this.fileType
      const content = init_file()
      create_new_file({ name, type, username, content }).then((id) => {
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
    goTeachPublic: function () {
      this.$router.push('/TeachPost')
    }
  },
  mounted () {
  },

}
</script>