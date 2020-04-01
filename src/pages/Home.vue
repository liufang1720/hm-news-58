<template>
  <div class="home">
    <!-- 头部 -->
    <div class="fixed">
      <div class="header">
        <div class="left">
          <span class="iconfont iconnew"></span>
        </div>
        <div class="center" @click="$router.push('/search')">
          <span class="iconfont iconsearch"></span>
          <span class="text">搜索新闻</span>
        </div>
        <div class="right" @click="$router.push('/user')">
          <span class="iconfont iconwode"></span>
        </div>
      </div>

      <!-- tab导航栏   animated:转场动画  swipeable:手势滑动  sticky:粘性定位布局 -->
      <van-tabs v-model="active" animated swipeable sticky>
        <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
          <!-- 上拉刷新van-pull-refresh  @refresh: 下拉会触发的refresh事件 refreshing： 控制下拉状态    -->
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <!-- 下拉加载更多组件 -->
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              :offset="50"
              :immediate-check="false"
            >
              <!-- hm-post组件 -->
              <hm-post v-for="post in postList" :key="post.id" :post="post"></hm-post>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
export default {
  //用于keep-alive的缓存使用
  name: 'home',
  data() {
    return {
      // 指定选中的那个tab
      active: 0,
      // 用于存放所有的tab栏数据
      tabList: [],
      // 用于存放文章的数据
      postList: [],
      // 控制List组件的加载状态
      loading: false,
      // 控制是否还有更多数据
      finished: false,
      // 当前页
      pageIndex: 1,
      // 每页的条数
      pageSize: 5,
      // 下拉的时候refreshing回变成true, 需要加载后，把refreshing改成false
      refreshing: false
    }
  },
  //勾子函数,拿tab栏数据渲染
  async created() {
    //从本地拿缓存的数据 如果本地有数据 就渲染本地的数据 没有的话 在发请求拿数据
    const activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
    if (activeTabs) {
      this.tabList = activeTabs
      // 发送请求，获取文章列表的数据
      this.getPostList(this.tabList[this.active].id)
      return
    }
    const res = await this.$axios.get('/category')
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.tabList = data
      this.getPostList(this.tabList[this.active].id)
    }
  },
  //方法
  methods: {
    //发请求 拿默认导航栏下的内容
    async getPostList(id) {
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 数据不能替换，只能追加
        this.postList = [...this.postList, ...data]
        // 数据加载完成，把loading改成false
        this.loading = false
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    //onLoad 触底触发加载事件
    onLoad() {
      const id = this.tabList[this.active].id
      setTimeout(() => {
        this.pageIndex++
        this.getPostList(id)
      }, 1000)
    },
    //下拉刷新
    onRefresh() {
      // 重新加载所有的数据
      this.pageIndex = 1
      this.postList = []
      this.loading = true
      this.finished = false
      this.refreshing = true
      setTimeout(() => {
        const id = this.tabList[this.active].id
        this.getPostList(id)
      }, 1000)
    }
  },
  //监听active的变化
  watch: {
    active(value) {
      // 切换栏目的时候，需要初始化所有的状态
      this.postList = []
      this.pageIndex = 1
      this.finished = false
      // loading不应该是false，应该是true，这样可以保证切换的时候不去触发onload事件
      this.loading = true
      const id = this.tabList[value].id
      this.getPostList(id)
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  line-height: 50px;
  display: flex;
  background-color: #ff0000;
  color: #fff;
  justify-content: space-between;
  padding-left: 10px;

  .left,
  .right {
    width: 60px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .iconnew {
    font-size: 50px;
  }
  .iconwode {
    font-size: 24px;
  }
  .center {
    flex: 1;
    background-color: rgba(255, 255, 255, 0.5);
    height: 34px;
    line-height: 34px;
    margin-top: 8px;
    border-radius: 17px;
    text-align: center;
    .text {
      font-size: 14px;
      margin-left: 5px;
    }
  }
}
// 深度选择器
/deep/ .van-tabs__nav {
  background-color: #ddd;
}
</style>