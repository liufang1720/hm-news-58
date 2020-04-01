<template>
  <div class="my-comment">
    <hm-header>我的跟帖</hm-header>

    <!-- 内容 -->
    <div class="list">
      <!-- 加载更多组件 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :offset="50"
        :immediate-check="false"
      >
        <div class="item" v-for="item in list" :key="item.id">
          <div class="time">{{ item.create_date | date('YYYY-MM-DD HH:mm') }}</div>
          <!--父评论  -->
          <div class="parent-comment" v-if="item.parent">
            <div class="parent-name">回复:{{ item.parent.user.nickname }}</div>
            <div class="parent-content">{{ item.parent.content }}</div>
          </div>
          <div class="content">{{ item.content }}</div>
          <div class="link" @click="$router.push(`/post-detail/${item.post.id}`)">
            <div class="title one-txt-cut">原文:{{ item.post.title }}</div>
            <span class="iconfont iconjiantou1"></span>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      pageIndex: 1,
      pageSize: 10
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    getCommentList() {
      this.$axios({
        url: '/user_comments',
        method: 'get',
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      }).then(res => {
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          // this.list = data
          this.list = [...this.list, ...data]
          this.loading = false
          if (data.length < this.pageSize) {
            // 没有更多数据
            this.finished = true
          }
        }
      })
    },
    //加载更多方法
    onLoad() {
      setTimeout(() => {
        this.pageIndex++
        this.getCommentList()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  .time {
    font-size: 14px;
    color: #999;
    height: 30px;
    line-height: 30px;
  }
  .content {
    font-size: 16px;
    padding: 10px 0;
  }
  .link {
    color: #999;
    display: flex;
    margin-top: 10px;
    font-size: 14px;
    justify-content: space-between;
    .title {
      flex: 1;
    }
    span {
      width: 50px;
      text-align: right;
    }
  }
  .parent-comment {
    background-color: #ddd;
    padding: 10px;
    font-size: 14px;
    color: #999;
    line-height: 30px;
    .parent-name {
      font-size: 12px;
    }
  }
}
</style>
