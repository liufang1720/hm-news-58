<template>
  <div class="search">
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="back">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <span class="iconfont iconsearch"></span>
        <input type="text" placeholder="请输入搜索关键字" v-model.trim="keyword" @input="recommend" />
      </div>
      <div class="right" @click="search">搜索</div>
    </div>

    <!-- 推荐列表 -->
    <div class="recommend" v-if="recommendList.length > 0">
      <div
        class="item one-txt-cut"
        v-for="item in recommendList"
        :key="item.id"
        @click="history_search(item.title)"
      >{{ item.title }}</div>
    </div>
    <!-- 渲染文章列表 -->
    <div class="post-list" v-else-if="postList.length > 0">
      <hm-post v-for="post in postList" :key="post.id" :post="post"></hm-post>
    </div>

    <!-- 历史记录 -->
    <div class="content" v-else>
      <h3>历史记录</h3>
      <div class="list">
        <div
          class="item"
          v-for="item in history"
          :key="item"
          @click="history_search(item)"
        >{{ item }}</div>
      </div>
      <h3>热门搜索</h3>
      <div class="list">
        <div
          class="item"
          v-for="item in hotList"
          :key="item"
          @click="history_search(item)"
        >{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
//导入lodash
import _ from 'lodash'
export default {
  data() {
    return {
      //搜索关键字
      keyword: '',
      //文章列表
      postList: [],
      //历史记录
      history: [],
      //热门搜索列表
      hotList: [],
      //推荐列表
      recommendList: []
    }
  },
  created() {
    //页面一加载 渲染历史记录
    const history = localStorage.getItem('history')
    if (history) {
      this.history = JSON.parse(history)
    }
    //热门搜索列表
    this.hotList = ['情火', '亲爱的', '新冠肺炎', '复工']
  },
  methods: {
    //搜索按钮的事件
    async search() {
      // 搜索时，关闭推荐
      this.recommendList = []
      //把搜索关键字 添加到历史记录中
      this.history = this.history.filter(v => v !== this.keyword)
      this.history.unshift(this.keyword)
      localStorage.setItem('history', JSON.stringify(this.history))
      //   发ajax 获取搜索列表
      const res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.keyword
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.postList = data
        console.log(this.postList)
      }
    },
    //点击左箭头 返回
    back() {
      if (this.keyword) {
        this.keyword = ''
      } else {
        this.$router.back()
      }
    },
    //历史记录搜索
    history_search(item) {
      this.keyword = item
      this.search()
    },
    //推荐列表
    recommend: _.debounce(async function() {
      console.log('123')
      // 如果输入的内容是空，不推荐
      if (!this.keyword) return
      // 发送请求，获取推荐数据
      const res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.keyword
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.recommendList = data
        console.log(this.recommendList)
      }
    }, 1000)
  },

  //监听事件
  watch: {
    //如果keyword为空，我们就显示历史记录和推荐
    keyword(value) {
      if (!value) {
        // 如果没有输入任何的内容，搜索结果清空
        this.postList = []
        this.recommendList = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  position: relative;
  .header {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    padding: 0 20px;
    .center {
      flex: 1;
      display: flex;
      padding: 0 10px;
      align-items: center;
      position: relative;
      input {
        border: none;
        outline: none;
        flex: 1;
        border: 1px solid #ccc;
        height: 34px;
        line-height: 34px;
        border-radius: 17px;
        font-size: 14px;
        padding-left: 30px;
      }
      .iconsearch {
        position: absolute;
        left: 17px;
        line-height: 34px;
      }
    }
    .right {
      font-size: 14px;
    }
  }
  .content {
    padding: 20px;
    h3 {
      font-size: 20px;
      padding: 10px 0;
    }
    .list {
      overflow: hidden;
      .item {
        font-size: 14px;
        background-color: #ddd;
        border: 1px solid #ccc;
        float: left;
        padding: 5px 10px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
  .recommend {
    position: absolute;
    background-color: #fff;
    z-index: 999;
    width: 100%;
    .item {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #ccc;
      padding: 0 20px;
      font-size: 14px;
    }
  }
}
</style>
