<template>
  <div class="tab-edit">
    <hm-header>栏目管理</hm-header>

    <div class="content">
      <p class="title">点击删除以下频道</p>
      <div class="list">
        <div
          class="item"
          v-for="item in activeTabs"
          :key="item.id"
          @click="del(item.id)"
        >{{item.name}}</div>
      </div>

      <p class="title">点击添加以下频道</p>
      <div class="list">
        <div
          class="item"
          v-for="item in deactiveTabs"
          :key="item.id"
          @click="add(item.id)"
        >{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  //数据
  data() {
    return {
      // 存放激活的栏目，默认所有的栏目都是激活的
      activeTabs: [],
      // 存放未激活的栏目
      deactiveTabs: []
    }
  },
  //勾子函数
  async created() {
    // 从本地获取栏目列表
    const activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
    const deactiveTabs = JSON.parse(localStorage.getItem('deactiveTabs'))
    if (activeTabs && deactiveTabs) {
      this.activeTabs = activeTabs
      this.deactiveTabs = deactiveTabs
      return
    }
    // 发ajax 获取栏目列表
    const res = await this.$axios.get('/category')
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.activeTabs = data
      this.deactiveTabs = []
      console.log(this.activeTabs, this.deactiveTabs)
    }
  },
  //方法
  methods: {
    //删除频道
    del(id) {
      if (this.activeTabs.length <= 3) {
        return this.$toast('请至少保留3个')
      }
      const idx = this.activeTabs.findIndex(item => item.id === id)
      this.deactiveTabs.push(this.activeTabs[idx])
      this.activeTabs.splice(idx, 1)
    },
    //添加频道
    add(id) {
      const idx = this.deactiveTabs.findIndex(item => item.id === id)
      this.activeTabs.push(this.deactiveTabs[idx])
      this.deactiveTabs.splice(idx, 1)
    }
  },
  //监听事件
  watch: {
    // 监听栏目的变化
    activeTabs: {
      deep: true,
      handler(value) {
        localStorage.setItem('activeTabs', JSON.stringify(this.activeTabs))
        localStorage.setItem('deactiveTabs', JSON.stringify(this.deactiveTabs))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 20px;
  .title {
    color: #999;
    font-size: 14px;
  }
  .list {
    margin-top: 10px;
    overflow: hidden;
    .item {
      padding: 10px 15px;
      float: left;
      border: 1px solid #ccc;
      background-color: #ddd;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>