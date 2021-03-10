<style lang="scss">
.post-container {
  overflow: auto;
  background-color: rgb(244, 244, 244);
  min-height: 100%;
}
</style>
<template>
  <div class="post-container">
    <one-post v-for="(item,index) in postList"
              v-bind="item"
              :imgUrl="IMG_DATA[index%4]"
              :key="`${item.postId}_${index}`"></one-post>
  </div>
</template>
<script>
import OnePost from './OnePost.vue'
import { GetAllPosts, GetStarAndLike } from '@/api'
import { mapMutations } from 'vuex'
const IMG_1 = require('@/assets/post/blue.png')
const IMG_2 = require('@/assets/post/green.png')
const IMG_3 = require('@/assets/post/orange.png')
const IMG_4 = require('@/assets/post/purple.png')
export default {
  components: {
    OnePost
  },
  data () {
    return {
      postList: [],
      IMG_DATA: [IMG_1, IMG_2, IMG_3, IMG_4],
    }
  },
  created () {
    const loading = this.$loading({})
    GetStarAndLike()
      .then(data => {
        this.getStarPosts(data.StarPosts)
        this.getLikePosts(data.LikePosts)
      })
    GetAllPosts()
      .then(data => {
        this.postList = data
      })
      .finally(() => {
        loading.close()
      })
  },
  methods: {
    ...mapMutations({
      getStarPosts: "STARPOSTS",
      getLikePosts: "LIKEPOSTS",
    })
  },
}
</script>