<template>
  <div class="hm-post" @click="$router.push(`/post-detail/${post.id}`)">
    <!-- 视频-->
    <div class="video-post" v-if="post.type===2">
      <div class="title">{{post.title}}</div>
      <div class="video">
        <img :src="fixedUrl(post.cover[0].url)" alt />
        <div class="paly">
          <span class="iconfont iconshipin"></span>
        </div>
      </div>
      <div class="bottom">
        <span>{{post.user.nickname}}</span>
        <span>{{post.comment_length}}跟帖</span>
      </div>
    </div>

    <!-- 一张图片 -->
    <div class="single-img-post" v-else-if="post.cover.length<3">
      <div class="info">
        <div class="title">{{post.title}}</div>
        <div class="bottom">
          <span>{{post.user.nickname}}</span>
          <span>{{post.comment_length}}跟帖</span>
        </div>
      </div>
      <img :src="fixedUrl(post.cover[0].url)" alt />
    </div>

    <!-- 三张图片 -->
    <div class="multiple-img-post" v-else>
      <div class="title">{{post.title}}</div>
      <div class="imgs">
        <img :src="fixedUrl(post.cover[0].url)" alt />
        <img :src="fixedUrl(post.cover[1].url)" alt />
        <img :src="fixedUrl(post.cover[2].url)" alt />
      </div>
      <div class="bottom">
        <span>{{post.user.nickname}}</span>
        <span>{{post.comment_length}}跟帖</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  //接受父组件传来的数据
  props: {
    post: Object
  },
  //修复url地址
  methods: {
    fixedUrl(url) {
      if (url.startsWith('http')) {
        return url
      } else {
        return this.$axios.defaults.baseURL + url
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 单张图片样式
.single-img-post {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  justify-content: space-between;
  img {
    width: 121px;
    height: 75px;
    display: block;
    object-fit: cover;
  }
  .info {
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
}

//三张图片样式
.multiple-img-post {
  border-bottom: 1px solid #ccc;
  padding: 10px;
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
  .imgs {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    img {
      width: 112px;
      height: 74px;
      display: block;
      object-fit: cover;
    }
  }
}

//视频样式
.video-post {
  border-bottom: 1px solid #ccc;
  padding: 10px;
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
  .video {
    padding: 10px 0;
    position: relative;
    img {
      width: 340px;
      height: 170px;
      display: block;
      object-fit: cover;
    }
    .paly {
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.4);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .iconshipin {
        font-size: 32px;
        color: #fff;
      }
    }
  }
}
</style>