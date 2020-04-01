<template>
  <div class="my-follow">
    <hm-header>我的关注</hm-header>
    <!-- 关注列表 -->
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="left">
          <img :src="$axios.defaults.baseURL + item.head_img" alt="" />
        </div>
        <div class="center">
          <div class="name">{{ item.nickname }}</div>
          <div class="time">{{ item.create_date | date }}</div>
        </div>
        <div class="right" @click="unFollow(item.id)">取消关注</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  //勾子函数
  created() {
    this.getFollowList()
  },
  //方法
  methods: {
    //渲染页面
    getFollowList() {
      this.$axios({
        url: '/user_follows',
        method: 'get'
      }).then(res => {
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          this.list = data
        }
      })
    },
    //取消关注
    unFollow(id) {
      //弹出确认框
      this.$dialog
        .confirm({
          title: '温馨提示',
          message: '你确定要取消关注此用户吗?'
        })
        .then(() => {
          //点击了确定
          this.$axios({
            url: `/user_unfollow/${id}`,
            method: 'get'
          }).then(res => {
            const { statusCode, message } = res.data
            if (statusCode === 200) {
              // 提示消息
              this.$toast.success(message)
              // 重新渲染
              this.getFollowList()
            }
          })
        })
        .catch(() => {
          //点击了取消
          this.$toast('操作取消')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  display: flex;
  border-bottom: 1px solid #ccc;
  height: 80px;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  .left {
    img {
      width: 40px;
      height: 40px;
      display: block;
      border-radius: 50%;
    }
  }
  .center {
    flex: 1;
    padding-left: 10px;
    .name {
      font-size: 14px;
    }
    .time {
      color: #999;
      font-size: 12px;
    }
  }
  .right {
    height: 30px;
    line-height: 30px;
    background-color: #ddd;
    border-radius: 15px;
    padding: 0 15px;
  }
}
</style>
