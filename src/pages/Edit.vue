<template>
  <div class="edit">
    <hm-header>编辑资料</hm-header>
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt />
      <van-uploader
        class="uploader"
        :before-read="beforeRead"
        :after-read="afterRead"
      />
    </div>

    <!-- 编辑框 -->
    <hm-navbar
      title="昵称"
      :content="info.nickname"
      @click="showNickname"
    ></hm-navbar>
    <hm-navbar
      title="密码"
      :content="info.password.replace(/./g, '*')"
      @click="showPassword"
    ></hm-navbar>
    <hm-navbar
      title="性别"
      :content="info.gender === 1 ? '男' : '女'"
      @click="showGender"
    ></hm-navbar>

    <!-- 修改昵称弹框  show 是控制弹框显示和隐藏的-->
    <van-dialog
      v-model="show"
      title="修改昵称"
      show-cancel-button
      @confirm="editNickname"
    >
      <van-field v-model="nickname" placeholder="请输入昵称" />
    </van-dialog>

    <!-- 密码框的修改   -->
    <van-dialog
      v-model="show1"
      title="修改密码"
      show-cancel-button
      @confirm="editPassword"
    >
      <van-field v-model="password" placeholder="请输入密码" />
    </van-dialog>

    <!-- 性别的修改 -->
    <van-dialog
      v-model="show2"
      title="修改性别"
      show-cancel-button
      @confirm="editGender"
    >
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <van-radio slot="right-icon" :name="1" />
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <van-radio slot="right-icon" :name="0" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>

    <!-- 裁切图片 -->
    <div class="cropper-mask" v-show="showCropper">
      <vue-cropper
        :img="img"
        :autoCrop="true"
        :autoCropWidth="150"
        :autoCropHeight="150"
        :fixed="true"
        ref="cropper"
      ></vue-cropper>
      <van-button class="crop" type="primary" @click="crop">裁剪</van-button>
      <van-button class="cancel" type="info" @click="cancel">取消</van-button>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  //注册裁切图片的组件
  components: {
    VueCropper
  },
  created() {
    this.getInfo()
  },
  data() {
    return {
      info: { password: '' },
      show: false,
      nickname: '',
      show1: false,
      password: '',
      show2: false,
      gender: 1,
      showCropper: false,
      img: ''
    }
  },
  methods: {
    //发送请求 渲染页面
    getInfo() {
      const user_id = localStorage.getItem('user_id')
      this.$axios({
        url: `/user/${user_id}`,
        method: 'get'
      }).then(res => {
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          this.info = data
        }
      })
    },
    //封装一个渲染页面的方法
    editUser(data) {
      const user_id = localStorage.getItem('user_id')
      this.$axios({
        url: `/user_update/${user_id}`,
        method: 'post',
        data: data
      }).then(res => {
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.getInfo()
          this.$toast.success(message)
        }
      })
    },
    //昵称修改弹框的显示
    showNickname() {
      this.show = true
      this.nickname = this.info.nickname
    },
    //修改昵称
    editNickname() {
      this.editUser({
        nickname: this.nickname
      })
    },
    //点击修改密码框显示
    showPassword() {
      this.show1 = true
      this.password = this.info.password
    },
    //修改密码
    editPassword() {
      this.editUser({
        password: this.password
      })
    },
    //点击修改姓名框提示消息
    showGender() {
      this.show2 = true
      this.gender = this.info.gender
    },
    //修改性别
    editGender() {
      this.editUser({
        gender: this.gender
      })
    },
    //点击头像 弹出裁剪框
    afterRead(file) {
      this.showCropper = true
      this.img = file.content
    },
    //点击裁切里的取消 不做任何修改
    cancel() {
      this.showCropper = false
      this.img = ''
    },
    //点击裁切按钮 裁切图片 上传
    crop() {
      this.$refs.cropper.getCropBlob(data => {
        //data  可以拿到裁剪后的照片
        const fd = new FormData()
        //将裁剪后的照片 添加到fordata里
        fd.append('file', data)
        this.$axios({
          url: '/upload',
          method: 'post',
          data: fd
        }).then(res => {
          const { statusCode, data } = res.data
          if (statusCode === 200) {
            //隐藏 裁剪框
            this.showCropper = false
            this.img = ''
            //调用方法 修改头像
            this.editUser({
              head_img: data.url
            })
          }
        })
      })
    },
    //上传头像前的效验
    beforeRead(file) {
      if (file.size / 1024 >= 200) {
        this.$toast.fail('文件大小不能超过200kb')
        return false
      }
      if (file.type !== 'image/jpeg') {
        this.$toast.fail('上传的文件必须是jpg图片')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  position: relative;
  img {
    width: 70px;
    height: 70px;
    display: block;
    border-radius: 50%;
    margin: 30px auto;
  }
  .uploader {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
  }
}
.van-dialog {
  padding: 0 10px;
}
.van-field {
  border: 1px solid #ccc;
}
.cropper-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  .crop,
  .cancel {
    position: absolute;
    top: 0;
  }
  .crop {
    left: 0;
  }
  .cancel {
    right: 0;
  }
}
</style>
