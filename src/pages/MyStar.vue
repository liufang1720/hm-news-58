<template>
  <div class="mystar">
    <hm-header>我的收藏</hm-header>
    <!-- 收藏列表 -->
    <hm-post v-for="post in list " :key="post.id" :post="post"></hm-post>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  async created() {
    const res = await this.$axios.get('/user_star')
    // console.log(res)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      data.forEach(v => {
        v.comment_length = v.comments.length
      })
      this.list = data
      console.log(this.list)
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  justify-content: space-between;
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      font-size: 16px;
    }
    .bottom {
      font-size: 12px;
      color: #999;
      span {
        margin-right: 10px;
      }
    }
  }
  img {
    width: 121px;
    height: 75px;
    display: block;
    object-fit: cover;
  }
}
</style>