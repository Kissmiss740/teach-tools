<style lang="scss">
.teach-env-wrap {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .top-half {
    width: 100%;
    height: 44%;
    border-bottom: 1px solid #c2c5cb;
  }
  .content {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    .env {
      height: 50%;
      padding-top: 25px;
      .el-divider {
        margin: auto;
      }
      .env-intro-wrap {
        height: 100%;
        width: 100%;
        padding-top: 10px;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: space-evenly;
        align-items: center;
      }
    }
  }

  .intro-content {
    width: 150px;
    height: 70px;
    padding: 20px 24px;
    cursor: pointer;
    background-color: #409eff;
    color: #fff;
    border-radius: 10px;
    border: 1px solid #ebeef5;
    font-weight: bolder;
  }
  .intro-content:hover {
    box-shadow: 3px 3px 10px #888888;
  }
  .el-row {
    height: 100%;
  }
  .soft-env {
    border-left: 2px dashed #dcdfe6;
  }
  .env-select-col {
    padding: 20px 40px;
    height: 100%;
    .env-select-container {
      width: 100%;
      padding: 0 30px;
      .env-select {
        width: 100%;
      }
      p {
        font-size: 14px;
        margin: 2em 0;
      }
    }
  }
}
</style>
<template>
  <div class="teach-env-wrap">
    <!-- 范例区 -->
    <div class="half-part top-half">
      <div class="content">
        <div class="env">
          <el-divider content-position="left">硬件环境</el-divider>
          <div class="env-intro-wrap">
            <el-popover v-for="(item,index) in envType.hardware"
                        :key="index"
                        :ref="item.id"
                        placement="top"
                        title="环境介绍"
                        width="300"
                        trigger="hover"
                        :content="item.value">
              <div class="intro-content"
                   slot="reference">{{item.type}}</div>
            </el-popover>
          </div>
        </div>
        <div class="env">
          <el-divider content-position="left">软件环境</el-divider>
          <div class="env-intro-wrap">
            <el-popover v-for="(item,index) in envType.software"
                        :key="index"
                        :ref="item.id"
                        placement="top"
                        title="环境介绍"
                        width="300"
                        trigger="hover"
                        :content="item.value">
              <div class="intro-content"
                   slot="reference">{{item.type}}</div>
            </el-popover>
          </div>
        </div>

      </div>
    </div>
    <!-- 教师编辑区 -->
    <el-row>
      <el-col :span="12"
              class="env-select-col">
        <el-divider content-position="left">硬件环境</el-divider>
        <div class="env-select-container">
          <p>提示：可以输入自定义环境，并按回车(Enter)添加。</p>
          <el-select v-model="hardTypeVal"
                     ref="hardSelect"
                     multiple
                     filterable
                     allow-create
                     class="env-select"
                     popper-class="popper-select"
                     default-first-option
                     placeholder="请选择硬件环境">
            <el-option v-for="item in hardTypes"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="12"
              class="env-select-col soft-env">
        <el-divider content-position="left">软件环境</el-divider>
        <div class="env-select-container">
          <p>提示：可以输入自定义环境，并按回车(Enter)添加。</p>
          <el-select v-model="softTypeVal"
                     multiple
                     filterable
                     allow-create
                     class="env-select"
                     default-first-option
                     placeholder="请选择软件环境">
            <el-option v-for="item in softTypes"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import {
  set_localStorage_checkedEnv,
  get_localStorage_checkedEnv
} from 'views/HtmlToWord.js'
import { UpdateModule } from '@/api'

export default {
  data () {
    return {
      exampleDialogVisiable: false,
      envType: {
        hardware: [
          {
            id: '1',
            type: '视频会议系统',
            value: '可用于知识探究类课程，运用视频会议系统连线相关领域工作人员/专家，与专家进行面对面交谈，交流疑问，带给学生最真实的学习体验。'
          },
          {
            id: '2',
            type: '基础网络系统',
            value: '用于自主学习类课程，基础网略系统支撑学习者的线上学习，鼓励学习者自主学习与搜索，培养新时代下学习者的信息素。'
          },
          {
            id: '3',
            type: '智能交互系统',
            value: '用于各类课程，要求教室中装有智能交互系统，课上教师对学习者课堂作业进行及时展示与评价，多屏展示学生作业，进行对比学习，促进学习者合作能力与批判能力的发展。'
          }
        ],
        software: [
          {
            id: '4',
            type: '教学辅助应用软件',
            value: '运用问卷星等工具实现及时评价与分析，运用IBOOK等软件实现教材的立体化，动画版的学习资料增加学习者的学习兴趣与动机。'
          },
          {
            id: '5',
            type: '数据存储系统',
            value: '用于各类教学相关人员上传数据（学习、讨论、交流等），常见的有三通两平台、云课堂等，以实现校校通、人人通，存储学生、老师长传的学习、讨论、交流等各种资料。'
          },
          {
            id: '6',
            type: '学习资源系统',
            value: '常见的资源系统包括MOOC、百度学术、中学学科网，国家教育资源公共服务平台、教师培训中心等，网站或软件中包括课件、案例、试卷、电子文献等各种资料，实现优质资源的传播与共享。'
          }
        ]
      },
      hardTypes: ['视频会议系统', '基础网络系统', '智能交互系统'],
      softTypes: ['iBook', '问卷星', '几何画板', 'MOOC', '网络学习空间'],
      hardTypeVal: get_localStorage_checkedEnv('Teach_Hard_Env'),
      softTypeVal: get_localStorage_checkedEnv('Teach_Soft_Env')
    }
  },
  watch: {
    'hardTypeVal': function (newVal) {
      let key = 'Teach_Hard_Env'
      this.$store.commit('SAVED')
      set_localStorage_checkedEnv(key, newVal)
      let id = localStorage.getItem('file_id')
      UpdateModule({
        id,
        module: key,
        value: newVal.join('、')
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
    },
    'softTypeVal': function (newVal) {
      let key = 'Teach_Soft_Env'
      this.$store.commit('SAVED')
      set_localStorage_checkedEnv(key, newVal)
      let id = localStorage.getItem('file_id')
      UpdateModule({
        id,
        module: key,
        value: newVal.join('、')
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
    },

  },
  methods: {

  },
  mounted () {
    this.$nextTick(() => {
      this.$refs['hardSelect'].focus()
    })
  }
}
</script>

