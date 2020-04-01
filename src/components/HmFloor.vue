<template>
  <div class="wrapper">
    <hm-floor :count="count-1" v-if="comment.parent" :comment="comment.parent" @reply="reply"></hm-floor>
    <div class="hm-floor" :class="{bt:!comment.parent}">
      <!-- 头部 -->
      <div class="header">
        <div class="left">{{count}}楼{{comment.user.nickname}}</div>
        <div class="center">{{comment.create_date | date2}}</div>
        <div class="right" @click="reply(comment.id,comment.user.nickname)">回复</div>
      </div>
      <!-- 内容 -->
      <div class="content">{{comment.content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  // 想在组件中使用组件本身，需要给组件指定name属性
  name: 'hm-floor',
  props: {
    comment: Object,
    count: Number
  },
  //方法
  methods: {
    reply(id, nickname) {
      // console.log('这是楼层评论的id,nickname', id, nickname)
      this.$emit('reply', id, nickname)
    }
  }
}
</script>   

<style lang="less" scoped>
.hm-floor {
  background-color: #eee;
  padding: 10px;
  border: 1px solid #ccc;
  border-top: none;
  &.bt {
    border-top: 1px solid #ccc;
  }
  .header {
    display: flex;
    font-size: 14px;
    .center {
      flex: 1;
      padding-left: 10px;
      color: #999;
    }
    .right {
      color: #999;
      font-size: 12px;
    }
  }
  .content {
    font-size: 14px;
    padding: 10px 0;
  }
}
</style>