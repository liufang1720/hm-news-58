<template>
  <div class="hm-comment">
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <img :src="$axios.defaults.baseURL + comment.user.head_img" alt />
      </div>
      <div class="center">
        <div class="name">{{comment.user.nickname}}</div>
        <div class="time">{{comment.create_date |date2}}</div>
      </div>
      <div class="right" @click="reply(comment.id,comment.user.nickname)">回复</div>
    </div>

    <!-- 楼层 -->
    <hm-floor
      :count="getCount(0,comment)"
      v-if="comment.parent"
      :comment="comment.parent"
      @reply="aa"
    ></hm-floor>
    <!--评论内容  -->
    <div class="content">{{comment.content}}</div>
  </div>
</template>

<script>
//引入HmFloor组件
import HmFloor from './HmFloor'
export default {
  props: {
    comment: Object
  },
  // 注册HmFloor组件
  components: {
    HmFloor
  },
  //方法
  methods: {
    // 需要在评论中统计一下总共的楼层数
    getCount(num, obj) {
      if (obj.parent) {
        return this.getCount(num + 1, obj.parent)
      } else {
        return num
      }
    },
    // 触发回复事件
    reply(id, nickname) {
      // 把id传给父组件，，，子传父
      // console.log('这是父组件comment.vue 接受到的id,nickname', id, nickname)
      this.$emit('reply', id, nickname)
    },
    //触发 楼层组件传过来的id,nickname
    aa(id, nickname) {
      this.$emit('reply', id, nickname)
    }
  }
}
</script>

<style lang="less" scoped>
.hm-comment {
  padding: 20px;
  border-bottom: 1px solid #ccc;
  align-items: center;
  .header {
    display: flex;
    margin-bottom: 10px;
    .left {
      img {
        width: 50px;
        height: 50px;
        display: block;
        border-radius: 50%;
      }
    }
    .center {
      flex: 1;
      padding-left: 10px;
      .name {
        font-size: 16px;
        margin-top: 5px;
      }
      .time {
        font-size: 14px;
        color: #999;
      }
    }
    .right {
      margin-top: 5px;
      color: #999;
      font-size: 14px;
    }
  }
  //  评论内容
  .content {
    font-size: 16px;
    padding: 10px 0;
  }
}
</style>