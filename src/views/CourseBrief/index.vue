<style lang="scss" >
.brief-wrap {
  height: 100%;
  width: 100%;
  .top-half {
    border-bottom: 1px solid #c2c5cb;
    height: 25%;
    width: 100%;
    margin-top: 30px;
  }
  .bottom-half {
    width: 100%;
    padding-top: 20px;
    .editor-container {
      width: 96%;
      margin: 0 auto;
    }
  }

  .course-msg {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
<template>
  <div class="brief-wrap">
    <!-- 范例区 -->
    <div class="top-half">
      <div class="example-content">
        <p>课程所依托的教材/平台/软件，课程的学习内容为，通过本单元课程学习者将产出什么成果，在课程中有哪些具体体现，单元课程中每节课程的重点。本单元课程完成后期望学习者达到的学习目标。</p>
        <el-button type="primary"
                   @click="exampleDialogVisiable=true">范 例</el-button>
        <el-dialog title="范  例"
                   :visible.sync="exampleDialogVisiable"
                   class="example-dialog"
                   center>
          <p>本课程依托七年级下册美术课程，结合Mind+编程采用基于设计的STEM教学模型进行本次课程的设计和开发，项目主要围绕“智能可穿戴文化衫的设计与制作”。</p>
          <p>课程内容包含信息搜集、文化衫的文字图象色彩设计，Micro：bit智能硬件的综合使用、刻纸机的图案切割、镂印方法的学习、Mind+环境下智能硬件的编程等内容，内容涉及技术、工程、数学、艺术、编程等学科知识，目的在于通过基于设计的STEM+C课程的学习，期望学生在提高计算思维的同时提升美学素养。</p>
          <span slot="footer"
                class="dialog-footer">
            <el-button type="primary"
                       @click="exampleDialogVisiable = false">关 闭</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <!-- 编辑区 -->
    <div class="bottom-half">
      <!-- 教师编辑区 -->
      <div class="editor-container">
        <vue-ueditor-wrap v-model="Content"
                          mode="observer"
                          :observerDebounceTime="observerDebounceTime"
                          :config="config"></vue-ueditor-wrap>
      </div>
    </div>
  </div>
</template>
<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import config from 'views/editorConfig.js'
import {
  saveContentToLocal,
  getContentFromLocal
} from 'views/HtmlToWord.js'
import { UpdateModule } from '@/api'
import { mapMutations } from 'vuex'
export default {
  components: {
    VueUeditorWrap
  },
  data () {
    return {
      name: 'CourseBrief',
      Content: getContentFromLocal('CourseBrief'),
      exampleDialogVisiable: false,
      observerDebounceTime: 1000,
      config: config
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
        console.log(err)
        setTimeout(() => {
          this.$store.commit('SAVED')
        }, 500);
      })
    }
  },
  methods: {
  }
}
</script>

