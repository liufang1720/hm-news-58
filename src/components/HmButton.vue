<template>
  <div class="hm-button" @click="clickfn">
    <slot></slot>
  </div>
</template>

<script>
export default {
  methods: {
    clickfn() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="less" scopde>
.hm-button {
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #cc3300;
  border-radius: 25px;
  font-size: 18px;
  margin: 20px;
  color: #fff;
}
</style>
