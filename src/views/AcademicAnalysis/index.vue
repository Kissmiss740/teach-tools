<style lang="scss">
.analysis-wrap {
  height: 100%;
  width: 100%;
  .top-half {
    border-bottom: 1px solid #c2c5cb;
    height: 40%;
  }
  .bottom-half {
    padding-top: 20px;
    .editor-container {
      height: 100%;
      width: 96%;
      margin: 0 auto;
    }
  }
}
</style>
<template>
  <div class="analysis-wrap">
    <!-- 范例区 -->
    <div class="half-part top-half">
      <div class="example-content">
        <p>学情分析包括整体学习情况和已有知识和经验。</p>
        <p>（1）整体学习情况包括参与本次课程的学生学习情况，班级整体学习氛围，学生课堂表现，学习者特点以及课程实施过程中潜在的问题等。</p>
        <p>（2）已有的知识和经验：在开始课程时学生已具备哪些先验知识和学习经验，哪些知识经验不足，需要教师特别注意。</p>
        <el-button type="primary"
                   @click="exampleDialogVisiable=true">范 例</el-button>
        <el-dialog title="范  例"
                   :visible.sync="exampleDialogVisiable"
                   class="example-dialog"
                   center>
          <p> 学情分析</p>
          <p style="text-index:2em;">（1）整体学习情况：参与本次课程的学生整体学习情况较好，在学习的过程中班级整体学习氛围浓厚，课堂表现积极且富有探究意识，具备较好的观察和动手能力，乐学善学，对于本次课程的学习主题“运动会班级可穿戴智能文化衫的制作”非常感兴趣，个别同学并不擅于小组合作模式的学习，学习能力较弱，在教学过程中应给予及时指导。</p>
          <p style="text-index:2em;">（2）已有知识和经验：学校比较重视学生信息科学素质的培养，学生已经学习了部分micro：bit智能硬件，有在mind+环境中编程的学习经历，具有一定的信息技术软件操作能力，对于科学探究的方法也掌握得比较好，但是对于一部分Micro:bit 智能硬件比较陌生，还需要教师在学习项目时对 Micro:bit智能硬件的基本功能和编程过程进行教学。学生在学习之前没有接触过刻纸机，对于彩绘和镂印同样比较陌生，需要教师在这部分的内容上进行指导。</p>

          <span slot="footer"
                class="dialog-footer">
            <el-button type="primary"
                       @click="exampleDialogVisiable = false">关 闭</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <!-- 编辑区 -->
    <div class="half-part bottom-half">
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
import { UpdateModule } from '@/api'
import { saveContentToLocal, getContentFromLocal } from 'views/HtmlToWord.js'
export default {
  components: {
    VueUeditorWrap
  },
  data () {
    return {
      exampleDialogVisiable: false,
      name: 'Academic_Analysis',
      Content: getContentFromLocal('Academic_Analysis'),
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
        this.$store.commit('SAVED')
      }).catch(err => {
        console.log(err)
        this.$store.commit('SAVED')
      })
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

