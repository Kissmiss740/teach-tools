<style lang="scss">
.post-card {
  width: 680px;
  margin: 30px auto;
  .file-card {
    display: flex;
    width: 450px;
    margin: 10px auto 30px auto;
    background-color: #f5f6f7;
    border-radius: 5px;
    &:hover {
      box-shadow: 0 0 0 2px #e1eaff;
    }
    .el-col:first-child {
      padding: 10px;
    }
    &-btn {
      display: flex;
      align-items: center;
      .el-button {
        background: transparent;
        border: 1px solid #dee0e3;
        font-size: 24px;
        color: #000;
        padding: 8px;
        transition: border 1s;
        &:hover {
          color: red;
          border: 1px solid red;
        }
      }
    }
  }
  .card-foot {
    .el-col {
      border-right: 1px solid #e5e9ef;
      cursor: pointer;
      &:hover {
        color: red;
      }
      div {
        width: 100%;
        height: 100%;
        text-align: center;
      }
    }
    .el-col:last-child {
      border-right: none;
    }
  }
  .comment-container {
    margin-top: 20px;
    padding: 30px;
    border-top: 1px solid #e5e9ef;
    .el-row {
      border-bottom: 1px solid #e5e9ef;
    }
    .issue-container {
      padding-bottom: 16px;
      .el-textarea__inner {
        background-color: #f4f5f7;
        border: 1px solid #e5e9ef;
        &:hover {
          background-color: #fff;
          border-color: #00a1d6;
        }
      }
    }
  }
}
.btn-is-active {
  color: red !important;
}
</style>
<template>
  <el-card class="post-card">
    <h3>{{title}}</h3>
    <el-row>
      <el-col :span="6">
        <i class="el-icon-user-solid"></i>
        <span>分享自：{{author}}</span>
      </el-col>
      <el-col :span="18">
        <i class="el-icon-time"></i>
        <span>发布时间：{{time}}</span>
      </el-col>
    </el-row>
    <el-row>
      <p style="text-indent:2em;margin:10px 20px">{{description}}</p>
    </el-row>
    <el-row class="file-card">
      <el-col :span="6">
        <img :src="imgUrl"
             width="70px"
             height="70px">
      </el-col>
      <el-col style="flex:1;">
        <p>{{fileName}}</p>
        <p>类型：{{fileType==='template'?'模板':'教案'}}</p>
      </el-col>
      <el-col :span="6"
              class="file-card-btn">
        <el-tooltip content="收藏"
                    placement="top">
          <el-button icon="el-icon-star-on"
                     :class="{'btn-is-active':hasStar}"
                     @click.stop="starOrLike('star')"
                     circle></el-button>
        </el-tooltip>
        <el-tooltip content="下载"
                    placement="top">
          <el-button icon="el-icon-download"
                     @click="download"
                     circle></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row class="card-foot">
      <el-col :span="8"
              :class="{'btn-is-active':hasStar}">
        <div @click.stop="starOrLike('star')">
          <i class="el-icon-star-on"></i>
          {{`${hasStar?'已收藏':'收藏'}${star}`}}
        </div>
      </el-col>
      <el-col :span="8">
        <div @click.stop="showComment=!showComment">
          <i class="el-icon-s-comment"></i>
          评论 {{comments.length||0}}
        </div>
      </el-col>
      <el-col :span="8"
              :class="{'btn-is-active':hasLike}">
        <div @click.stop="starOrLike('like')">
          <i class="el-icon-s-opportunity"></i>
          {{`${hasLike?'已点赞':'点赞'}${like}`}}
        </div>
      </el-col>
    </el-row>
    <div class="comment-container"
         v-loading="commentLoading"
         v-show="showComment">
      <el-row class="issue-container">
        <el-col :span="3">{{username}}</el-col>
        <el-col :span="16">
          <el-input type="textarea"
                    v-model="review"
                    placeholder="发表一下你对这个教案/模板的想法吧~"></el-input>
        </el-col>
        <el-col :span="4"
                :push="1">
          <el-button type="primary"
                     @click="submitComment"
                     :disabled="!review"
                     size="small">发表评论</el-button>
        </el-col>
      </el-row>
      <p v-if="comments && comments.length==0"
         style="text-align:center;">还没有评论，快来抢第一吧~</p>
      <el-row v-for="(comment,index) in comments"
              :key="`comment_${index}`">
        <el-col :span="3">
          <p>{{comment.reviewer}}</p>
        </el-col>
        <el-col :span="18">
          <p>{{comment.time}}</p>
          <p>{{comment.content}}</p>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { LikeOnePost, CollectOnePost, AddOneComment, StarOrLikePost, GetOneFile } from '@/api'
import { download_word } from '@/utils/index'
export default {
  name: "OnePost",
  data () {
    return {
      showComment: false,
      review: '',
      hasStar: false,
      hasLike: false,
      commentLoading: false
    }
  },
  props: {
    postId: String,
    fileId: String,
    fileName: String,
    fileType: String,
    author: String,
    time: String,
    title: String,
    description: String,
    star: {
      type: Number,
      default: 0
    },
    like: {
      type: Number,
      default: 0
    },
    comments: {
      type: Array,
      default: () => []
    },
    imgUrl: String
  },
  computed: {
    username () {
      return this.$store.state.username
    },
    StarPosts () {
      return this.$store.state.StarPosts
    },
    LikePosts () {
      return this.$store.state.LikePosts
    }
  },
  methods: {
    openComment: function () {
      this.showComment = !this.showComment
    },
    //
    submitComment: function () {
      this.commentLoading = true
      let content = this.review,
        reviewer = this.username,
        postId = this.postId
      AddOneComment({ reviewer, postId, content })
        .then((data) => {
          this.comments.push(data)
          this.review = ''
        })
        .finally(() => {
          this.commentLoading = false
        })
    },
    starOrLike: function (type) {
      let username = this.username,
        fileId = this.fileId,
        postId = this.postId;
      let status;
      switch (type) {
        case 'star':
          status = this.hasStar
          StarOrLikePost({
            username,
            postId,
            fileId,
            type,
            status
          })
            .then(() => {
              if (this.hasStar) this.star--
              else this.star++
              this.hasStar = !status
            })
          break;
        case 'like':
          status = this.hasLike
          StarOrLikePost({
            username,
            postId,
            fileId,
            type,
            status
          })
            .then(() => {
              if (this.hasLike) this.like--
              else this.like++
              this.hasLike = !status
            })
          break;
      }
    },
    download: function () {
      let id = this.fileId
      GetOneFile(id)
        .then(data => {
          const { name, content, type } = data
          const { Teach_Hard_Env, Teach_Soft_Env } = content
          download_word(content, name, Teach_Hard_Env, Teach_Soft_Env)
        })
    }
  },
  mounted () {
    this.hasStar = this.StarPosts.indexOf(this.postId) !== -1
    this.hasLike = this.LikePosts.indexOf(this.postId) !== -1
  },
}
</script>