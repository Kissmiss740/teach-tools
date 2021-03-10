<style lang="scss">
.demand-wrap {
  p {
    font-size: 18px;
    line-height: 1.5;
    text-indent: 2em;
  }
  height: 100%;
  width: 100%;
  .el-main {
    overflow: hidden;
  }
  .top-half {
    border-bottom: 1px solid #c2c5cb;
    .example-content {
      width: 40%;
      margin: 20px auto;
    }
    .el-collapse {
      width: 80%;
      margin: 0 auto;
      .el-collapse-item__wrap {
        background-color: transparent;
        p {
          margin: 5px;
        }
      }
      .el-collapse-item__header {
        background-color: transparent;
        font-size: 16px;
        &.is-active {
          color: #409eff;
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
    }
  }
}
.table-wrap {
  width: 80%;
  height: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
  .el-table--small {
    font-size: 16px;
  }
}
.cellClass:hover {
  background-color: #b5b5b5 !important;
  cursor: pointer;
}
.table-tooltip {
  font-size: 16px;
  max-width: 400px;
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
  <el-container class="demand-wrap">
    <!-- 中间部分 -->
    <el-main>
      <!-- 范例区 -->
      <div class="top-half"
           v-show="clickDemandTagIndex==0">
        <!-- 表格 -->
        <div class="table-wrap"
             v-show="showTable">
          <p>布鲁姆将教学目标按照由低到高分为<strong><i>记忆、理解、运用、分析、评价、创造</i></strong>六个维度，每个教学目标维度可以用一系列的动词进行描述，具体如下表所示。</p>

          <el-table :data="tableData"
                    ref="table"
                    cell-class-name="cellClass"
                    size="small"
                    border
                    :header-cell-style="headerCellStyle"
                    @cell-click="cellClickEvent">
            <el-table-column label="认知目标"
                             prop="name"
                             align="center">
              <template slot-scope="scope">
                <el-tooltip placement="top"
                            popper-class="table-tooltip"
                            :enterable="false"
                            :content="scope.row.value">
                  <div slot="content">{{scope.row.name}}含义：<br />{{scope.row.value}}</div>
                  <div><strong><i>{{scope.row.name}}</i></strong></div>
                </el-tooltip>
              </template>
            </el-table-column>

            <template v-for="i in 5">
              <el-table-column label="常用动词"
                               :prop="`word${i}`"
                               align="center"
                               :key="i">
                <template slot-scope="scope">
                  <el-tooltip placement="top"
                              popper-class="table-tooltip"
                              :enterable="false">
                    <div slot="content">{{scope.row[`word${i}`]['name']}}范例：<br />{{scope.row[`word${i}`]['value']}}</div>
                    <div>{{scope.row[`word${i}`]['name']}}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
            </template>

          </el-table>
          <i>提示：点击动词查看具体范例</i>
        </div>
        <!-- 范  例 -->
        <div class="example-content"
             v-show="!showTable">
          <p>{{`${wordName}范例：`}}</p>
          <p>{{wordValue}}</p>
          <div style="overflow:hidden;">
            <el-button type="primary"
                       style="float:right;position:static;"
                       @click="showTable=true">返回</el-button>
          </div>
        </div>
      </div>
      <div class="top-half"
           v-show="clickDemandTagIndex==1">
        <el-collapse value="言语信息"
                     accordion>
          <p style="text-indent:2em;margin:0;">加涅将教学可能产生的结果即学生的学习结果或教学目标分为五类：言语信息、智力技能、认知策略、动作技能和态度。</p>
          <el-collapse-item v-for="gagne in GagneData"
                            :key="gagne.id"
                            :title="gagne.title"
                            :name="gagne.title">
            <template slot="title">
              <i class="el-icon-info"></i> --{{gagne.title}}
            </template>
            <p style="text-indent:2em;"><strong>含 义：</strong>{{gagne.desc}}</p>
            <p style="text-indent:2em;"><strong>范 例：</strong>{{gagne.example}}</p>
          </el-collapse-item>
        </el-collapse>
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
    </el-main>
    <!-- 右侧导航栏 -->
    <el-aside width="200px"
              class="demand-tag-aside">
      <el-tag :key="`demandtag_${index}`"
              :class="{'chosen-style':index===clickDemandTagIndex}"
              v-for="(tag,index) in demandList"
              @click="handleOptionTagClick(tag,index)">
        {{tag}}
      </el-tag>
    </el-aside>
  </el-container>
</template>
<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import config from 'views/editorConfig.js'
import DEMAND_DATA from './data'
import { UpdateModule } from '@/api'
import { saveContentToLocal, getContentFromLocal } from 'views/HtmlToWord.js'

export default {
  components: {
    VueUeditorWrap
  },
  data () {
    return {
      name: 'Teach_Demand',
      Content: getContentFromLocal('Teach_Demand'),
      observerDebounceTime: 1000,
      exampleDialogVisiable: false,
      tableData: DEMAND_DATA.BroomeDemand,
      GagneData: DEMAND_DATA.GagneDemand,
      showTable: true,
      wordName: '',
      wordValue: '',
      clickDemandTagIndex: 0,
      demandList: ['布鲁姆教学目标', '加涅教学目标'],
      config: config
    }
  },

  methods: {
    setColSpan: function () {
      //
      //
    },
    cellClickEvent (row, column, cell, event) {
      let col = column.property
      if (col === 'name') return
      this.showTable = false
      let word = row[col]
      this.wordName = word.name
      this.wordValue = word.value
    },

    headerCellStyle ({ row, column, rowIndex, columnIndex }) {
      switch (columnIndex) {
        case 1:
        case 2:
        case 4:
          return { borderRight: 'none', color: '#fff' }
        case 3:
          return { borderRight: 'none' }
        case 5:
          return { color: '#fff' }
      }
    },
    handleOptionTagClick (tag, index) {
      this.clickDemandTagIndex = index
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
  mounted () {
  }
}
</script>

