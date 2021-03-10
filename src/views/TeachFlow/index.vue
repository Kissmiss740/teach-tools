<style lang="scss">
.teachflow-wrap {
  .top-half {
    border-bottom: 1px solid #c2c5cb;
    height: 35%;
    .example-content {
      width: 70%;
      height: 100%;
      margin: 0 auto;
      position: relative;
      .el-divider__text {
        font-size: 18px;
        background-color: #f4f4f4;
      }
      p {
        text-indent: 2em;
        font-size: 18px;
        line-height: 1.5;
      }
      .el-button {
        position: absolute;
        bottom: 20px;
        right: 10px;
      }
    }
  }
  .bottom-half {
    height: 65%;
    padding-top: 20px;
  }
  .drag-box {
    border-left: 1px solid #c2c5cb;
    background-color: #ffffff;
    .el-divider__text {
      //
    }
    .drag-box-checked {
      padding: 0 25px;
      border-bottom: 1px solid #c2c5cb;
    }
    .drag-box-option {
      padding: 0 25px;
    }
    .item-ul {
      min-height: 200px;
      max-height: 500px;
      display: flex;
      flex-direction: column;
      .el-tag {
        width: 170px;
        margin: 5px auto;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
        .el-tag__close {
          position: static;
          float: right;
          transform: translateY(50%);
          color: #fff;
          background-color: #409eff;
        }
        .input-new-tag {
          display: inline-block;
          width: 130px;
          height: 100%;
          input {
            height: 100%;
            padding: 0;
            background: transparent;
            border: none;
            outline: none;
          }
        }
      }
    }
  }
  .chosen-style {
    background-color: #409eff;
    color: #fff;
  }
  .ghost-style {
    display: block;
    color: transparent;
    border-style: dashed;
  }
}
</style>

<template>
  <el-container class="teachflow-wrap">
    <el-main style="overflow:hidden;">
      <!--范例区 -->
      <div class="top-half">
        <div class="example-content">
          <el-divider content-position="left">{{curTitle||'自定义'}} ：</el-divider>
          <p>{{isDemand?curDemand:curExample}}</p>

          <el-button type="primary"
                     size="medium"
                     @click="isDemand=!isDemand">{{isDemand?'范 例':'返回'}}</el-button>
        </div>
      </div>
      <div class="bottom-half">
        <!-- 教师编辑区 -->
        <div class="editor-container">

          <vue-ueditor-wrap v-model="Content"
                            mode="observer"
                            :observerDebounceTime="observerDebounceTime"
                            :config="config"></vue-ueditor-wrap>
        </div>
      </div>
    </el-main>
    <el-aside width="250px"
              class="drag-box">
      <div class="drag-box-checked">
        <el-divider content-position="left">已选</el-divider>
        <draggable v-model="checkedList"
                   @change="checkedListChange"
                   :options="checkedDragOptions">
          <transition-group tag="div"
                            id="checkedList"
                            class="item-ul">
            <el-tag :key="`checkedtag_${index}`"
                    :class="{'chosen-style':index===clickCheckedTagIndex&&tag.title}"
                    v-for="(tag,index) in checkedList"
                    :closable="tagClosable"
                    @click="handleCheckedTagClick(tag,index)"
                    @close="handleClose(tag)">
              <template v-if="tag.title">
                {{tag.title}}
              </template>
              <el-input class="input-new-tag"
                        v-else
                        v-model="inputValue"
                        ref="saveTagInput"
                        @keyup.enter.native="$event.target.blur"
                        @blur="handleInputConfirm(tag)">
              </el-input>
            </el-tag>
          </transition-group>
        </draggable>
        <div v-show="checkedList.length>0">
          <el-button class="button-new-tag"
                     size="small"
                     icon="el-icon-circle-plus"
                     @click="showInput">添加</el-button>
          <el-button class="button-new-tag"
                     size="small"
                     :icon="tagClosable?'el-icon-success':'el-icon-remove'"
                     @click="delOrDoneBtn">{{`${tagClosable?'完成':'删除'}`}}</el-button>
        </div>

      </div>
      <div class="drag-box-option">
        <el-divider content-position="left">备选</el-divider>

        <draggable v-model="optionList"
                   :options="optionDragOptions">
          <transition-group tag="div"
                            id="optionList"
                            class="item-ul">
            <el-tag :key="`optiontag_${index}`"
                    :class="{'chosen-style':index===clickOptionTagIndex}"
                    v-for="(tag,index) in optionList"
                    @click="handleOptionTagClick(tag,index)"
                    @close="handleClose(tag)">
              {{tag.title}}
            </el-tag>
          </transition-group>
        </draggable>
      </div>
    </el-aside>
  </el-container>
</template>
<script>
import TAG_DATA from './data'
import draggable from 'vuedraggable'
import VueUeditorWrap from 'vue-ueditor-wrap'
import config from 'views/editorConfig.js'
import { create_flow_table, saveContentToLocal, getContentFromLocal } from 'views/HtmlToWord.js'
import { UpdateModule } from '@/api'
export default {
  components: {
    draggable, VueUeditorWrap
  },
  data () {
    //
    //
    //
    //
    //
    //
    //
    return {
      //
      checkedDragOptions: {
        animation: 120,
        scroll: true,
        group: {
          name: 'checkedList',
          pull: false,
          put: true
        },
        ghostClass: 'ghost-style',
      },
      //
      optionDragOptions: {
        animation: 120,
        scroll: true,
        group: {
          name: 'optionList',
          pull: 'clone',
          put: false
        },
        sort: false
      },
      inputValue: '',
      tagClosable: false,
      clickCheckedTagIndex: -1,
      clickOptionTagIndex: -1,
      checkedList: [],
      optionList: TAG_DATA.PBL,
      isDemand: true,
      curDemand: '',
      curExample: '',
      curTitle: '',
      exampleDialogVisiable: false,
      name: 'Teach_Flow',
      observerDebounceTime: 1000,
      Content: getContentFromLocal('Teach_Flow'),
      config: config
    }
  },
  watch: {
    //数组的顺序、长度发生改变也可以监听到
    'checkedList': {
      handler: function (newVal, oldVal) {
        //
        //
        this.Content = create_flow_table(newVal)
      },
      deep: true
    },
    clickCheckedTagIndex (newVal) {
      if (newVal > -1) this.clickOptionTagIndex = -1
    },
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
          console.log('保存成功')
        }, 500);
      }).catch(err => {
        setTimeout(() => {
          this.$store.commit('SAVED')
        }, 500);
      })
    }
  },
  methods: {
    //
    handleClose (tag) {
      this.checkedList.splice(this.checkedList.findIndex(item => item.id === tag.id), 1);
    },
    //
    msgUpdate (tag) {
      this.curDemand = tag.demand
      this.curExample = tag.example
      this.curTitle = tag.title
    },
    //
    handleCheckedTagClick (tag, index) {
      this.clickCheckedTagIndex = index
      this.isDemand = true
      this.msgUpdate(tag)
    },
    handleOptionTagClick (tag, index) {
      this.clickOptionTagIndex = index
      this.clickCheckedTagIndex = -1
      this.isDemand = true
      this.msgUpdate(tag)
    },
    //
    showInput () {
      let id = this.checkedList.length + 1
      this.clickCheckedTagIndex = -1
      this.curTitle = '自定义'
      this.curDemand = '教师可自定义其他教学活动添加至流程中。'
      //
      this.checkedList.push({ id: id, title: '', demand: '', time: 0, activeContent: '', files: '' });
      this.$nextTick(_ => {
        this.$refs.saveTagInput[0].focus()
      });
    },
    //
    delOrDoneBtn () {
      this.tagClosable = !this.tagClosable
      this.clickCheckedTagIndex = -1
    },
    //
    handleInputConfirm (tag) {
      let inputValue = this.inputValue;
      if (inputValue) {
        tag.title = inputValue
        this.clickCheckedTagIndex = this.checkedList.length - 1
      }
      else this.checkedList.pop()
      this.inputValue = '';
    },
    //
    checkedListChange (ev) {
      //
      let tag = ev['added'] || ev['moved']
      //
      this.clickCheckedTagIndex = tag.newIndex
      //
      this.msgUpdate(tag.element)
    },

    handleChangeChecked () {
      this.checkedList[0].title = '你好啊'
    },
  },
  mounted () {
    this.clickOptionTagIndex = 0
    let tag = this.optionList[0]
    this.msgUpdate(tag)
  },
}
</script>