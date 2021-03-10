<style lang="scss">
.article-container {
  background-color: #f4f4f4;
  width: 100%;
  height: 100%;
  .article-wrap {
    width: 80%;
    margin: 0 auto;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid rgb(127, 127, 127);
  }
  .section-title-cn {
    font-family: "微软雅黑";
    font-weight: 700;
    font-size: 27px;
    color: rgb(0, 0, 0);
  }
  .section-title-en {
    margin-left: 20px;
    font-family: "Arial";
    font-weight: 700;
    font-size: 27px;
    color: #7f7f7f;
  }
  ul {
    margin: 0;
    li {
      list-style: none;
      border-bottom: 1px solid rgb(127, 127, 127);
      padding: 15px 0;
      &:first-child {
        padding: 20px 0;
      }
      a {
        text-decoration: none;
        color: #333;
        font-family: 微软雅黑, sans-serif;
        font-weight: 400;
        &:hover {
          color: rgb(127, 127, 127);
        }
      }
    }
  }
}
</style>
<template>
  <div class="article-container">
    <div class="article-wrap">
      <el-row>
        <el-col :span="14">
          <ul>
            <li>
              <span class="section-title-cn">
                学习资料
              </span>
              <span class="section-title-en">
                LEARNING MATERIALS
              </span>
            </li>
            <li v-for="(item,index) in articleList"
                :key="`article_${index}`">
              <a :href="item.url"
                 title="点击打开文章"
                 target="_blank">{{item.title}}</a>
            </li>
          </ul>
        </el-col>
        <el-col :span="6"
                :push="2">
          <ul>
            <li>
              <span class="section-title-cn">
                更多资讯
              </span>
              <span class="section-title-en">
                MORE
              </span>
            </li>
            <p style="font-family:'微软雅黑,sans-serif';margin:20px 0;">请扫描二维码关注公众号了解更多</p>
            <img :src="imgUrl"
                 width="250"
                 height="250"
                 alt="公众号二维码">
          </ul>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
const QR = require('@/assets/qr.jpg')
import ArticleList from './data'
export default {
  data () {
    return {
      imgUrl: QR,
      articleList: ArticleList
    }
  }
}
</script>