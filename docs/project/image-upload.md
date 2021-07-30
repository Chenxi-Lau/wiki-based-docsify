<!--
 * @Author: your name
 * @Date: 2021-07-30 14:40:00
 * @LastEditTime: 2021-07-30 14:45:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify-based-wiki\docs\project\imageUpload.md
-->

# cropperjs 实现图片上传功能

> 利用 cropperjs 实现 H5 端的图片上传功能。

代码如下：

```vue
<template>
  <div class="face-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar class="nav-bgc" title="信息采集"></van-nav-bar>
    <van-form class="page-from">
      <div class="page-file">
        <div class="page-file-wrap">
          <div v-show="showImg" class="show">
            <div class="picture" :style="'backgroundImage:url(' + faceImg + ')'" />
          </div>
        </div>
      </div>
      <!-- 人脸对比后的反馈信息 -->
      <div class="tip-txt">
        <template v-if="!faceSuccess">
          <p class="face-default-tip" align="center">还未采集人脸信息</p>
          <p class="face-default-subtip" align="center">采集人脸信息后可录入至平台</p>
        </template>
        <p v-else class="face-default-tip" align="center">人脸信息采集成功</p>
      </div>
      <!-- 展示姓名账号信息的表单 -->
      <div class="face-form">
        <van-form>
          <van-field
            v-model="faceForm.username"
            label="姓名"
            name="账号"
            left-icon="info-o"
            placeholder=""
            label-width="40px"
            disabled
          />
          <van-field
            v-model="faceForm.studentId"
            label="账号"
            name="账号"
            left-icon="user-o"
            label-width="40px"
            disabled
          />
        </van-form>
      </div>
      <!-- 现在采集/重新采集的按钮 -->
      <div class="face-btn-box">
        <input id="file" class="page-file-input" type="file" accept="image/*" readonly @change="uploadPicture" />
        <span v-if="!faceSuccess" class="page-btn-text">现在采集</span>
        <span v-else class="page-btn-text">重新采集</span>
      </div>
    </van-form>
    <!-- 遮罩层：剪裁区域，container为最外层容器，外加两个操作按钮 -->
    <div v-show="isShowCropBox" class="container">
      <div class="show-image">
        <img id="image" :src="rawImagePath" alt="Picture" />
      </div>
      <div class="page-cropper-btns">
        <div class="page-cropper-btn" @click="rephotograph">重拍</div>
        <div class="page-cropper-btn" @click="usePicture">使用照片</div>
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs';
import { Toast, Dialog } from 'vant';
import { getUserData, collectFace } from '@/api';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'CollectFace',
  data() {
    return {
      showImg: false, // 是否显示人脸采集的照片
      rawImagePath: '', // 上传图片的生成的路径
      faceImg: '', // 人脸图片的URL Base64
      headerImage: '', // 人脸图片URL的过渡变量
      cropper: {}, // 剪裁框对应的cropper对象
      croppable: false, // 插件是否加载完成
      isShowCropBox: false, // 是否显示剪裁框
      faceSuccess: false, // 人脸采集是否成功
      faceForm: {
        username: '',
        studentId: ''
      } // 展示姓名账号信息的表单
    };
  },
  computed: {
    ...mapGetters(['jobNo'])
  },
  mounted() {
    this.initCropper();
  },
  created() {
    // TODO
  },
  methods: {
    ...mapActions(['syncJobNo']),

    // 获取人员信息
    async initData(params) {
      try {
        const res = await getUserData(params);
        if (res.code === '0' && res.data) {
          this.faceForm.username = res.data.name;
          this.faceForm.studentId = res.data.jobNo;
          this.syncJobNo(res.data.jobNo);
          if (res.data.personFace) {
            this.showImg = true;
            this.faceSuccess = true;
            this.faceImg = 'data:image/jpeg;base64,' + res.data.personFace;
          } else {
            this.showImg = false;
            this.faceSuccess = false;
          }
        }
      } catch (err) {
        const failMsg = err.constructor === Object ? err.data.msg : err;
        Toast.fail('请求失败' + failMsg);
      }
    },

    // 初始化裁剪工具
    initCropper() {
      const self = this;
      const cropBox = document.getElementById('image');
      this.cropper = new Cropper(cropBox, {
        aspectRatio: 5 / 7,
        dragMode: 'move', // 'crop':创建一个新的裁剪框，'move':移动画布，'none':do nothing
        dragCrop: true,
        movable: true,
        resizable: true,
        viewMode: 1,
        background: true,
        zoomable: true, // 启用缩放图像。
        mouseWheelZoom: true, // 启用旋转图像。
        touchDragZoom: true,
        rotatable: true,
        center: true,
        crop: function () {},
        ready: function () {
          self.croppable = true;
        } // 渲染前（图片已经被加载、cropper实例已经准备完毕）的准备工作事件
      });
    },

    // 取消上传，重拍，隐藏剪裁框
    rephotograph() {
      this.isShowCropBox = false;
    },

    // input框change事件，获取到上传的图片
    uploadPicture(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      const cropperAcceptImgType = ' image/jpeg, image/jpg'; // 可接受的图片类型
      const type = files[0].type; // 文件的类型，判断是否是图片
      const size = files[0].size; // 文件的大小，判断图片的大小
      if (cropperAcceptImgType.indexOf(type) === -1) {
        Toast({
          message: '请上传jpg或jpeg格式的图片',
          duration: 1200
        });
        return false;
      }
      if (size > 6 * 1024 * 1024) {
        Toast({
          message: '请选择6M以内的图片！',
          duration: 1200
        });
        return false;
      }
      this.rawImagePath = this.getObjectURL(files[0]);
      if (this.cropper) {
        this.cropper.replace(this.rawImagePath); // 每次替换图片要重新得到新的url
      }
      this.isShowCropBox = true;
    },

    // 创建url路径, URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL
    getObjectURL(file) {
      let url = null;
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file); // basic
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file); // mozilla(firefox)
      } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file); // webkit or chrome
      }
      return url;
    },

    // 使用照片触发的事件，提交剪裁后的图片
    usePicture() {
      this.isShowCropBox = false;
      if (!this.croppable) {
        return;
      }
      const croppedCanvas = this.cropper.getCroppedCanvas(); // 拿到裁剪后的图片
      const roundedCanvas = this.getRoundedCanvas(croppedCanvas); // 对剪裁后图片进行canvas画图
      this.headerImage = roundedCanvas.toDataURL(); // 转为URL数据
      // TODO
      this.faceImg = this.headerImage;
      this.showImg = true;
      this.faceSuccess = true;
      // this.imageDetect() //! 上传图片，和后端数据库进行对比
    },

    // 对剪裁后图片进行canvas画图
    getRoundedCanvas(sourceCanvas) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const width = sourceCanvas.width;
      const height = sourceCanvas.height;
      canvas.width = width;
      canvas.height = height;
      context.imageSmoothingEnabled = true;
      context.drawImage(sourceCanvas, 0, 0, width, height);
      context.globalCompositeOperation = 'destination-in';
      context.beginPath();
      context.fill();
      return canvas;
    }
  }
};
</script>

<style lang="scss">
.face-container {
  .nav-bgc {
    background-color: #333;
    .van-nav-bar__title {
      font-weight: 500;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  .page-file {
    position: relative;
    margin-top: 1.875rem;
    background-size: 100% 100%;
    .page-file-wrap {
      width: 9.375rem;
      height: 13.125rem;
      margin: 0 auto;
      background-image: url('../assets/images/face.jpg');
      background-repeat: no-repeat;
      background-size: contain;
      .page-file-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 10;
      }
    }
  }
  .tip-txt {
    width: 12.5rem;
    margin: 0 auto;
    .face-default-tip {
      width: 100%;
      height: 1.25rem;
      line-height: 1.25rem;
      margin: 0.5rem 0;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .face-default-subtip {
      width: 100%;
      font-size: 0.75rem;
      color: rgba(158, 158, 158, 0.7);
    }
  }
  .face-form {
    width: 15rem;
    margin: 1.25rem auto 0;
  }
  .face-btn-box {
    position: relative;
    width: 12.5rem;
    margin: 2.5rem auto;
    text-align: center;
    .page-btn-text {
      padding: 0.75rem 2.5rem;
      border-radius: 2.5rem;
      font-size: 0.875rem;
      background-color: rgba(194, 30, 33, 1);
      color: rgba(255, 255, 255, 1);
      border: 0;
    }
  }
  .page-file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 10;
  }
}
#button,
#cancel {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 80px;
  height: 40px;
  border: none;
  border-radius: 5px;
  background: white;
}
#cancel {
  left: 10px;
}
.show {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  // border-radius: 50%;
  border: 1px solid #d5d5d5;
  .picture {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
.container {
  z-index: 99;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  // background: rgba(0, 0, 0, 1);
  .show-image {
    height: 100%;
    image-orientation: 0deg;
    max-height: none !important;
    max-width: none !important;
    min-height: 0 !important;
    min-width: 0 !important;
    width: 100%;
  }
  .page-cropper-btns {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4.75rem;
    align-items: center;
    z-index: 2147483647;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    .page-cropper-btn {
      opacity: 0.9;
      font-size: 1rem;
      line-height: 1rem;
      color: #fff;
      padding: 0 2.25rem;
    }
  }
}
#image {
  max-width: 100%;
  height: auto;
}
.cropper-container {
  direction: ltr;
  font-size: 0;
  line-height: 0;
  position: relative;
  -ms-touch-action: none;
  touch-action: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.cropper-container img {
  display: block;
  height: 100%;
  image-orientation: 0deg;
  max-height: none !important;
  max-width: none !important;
  min-height: 0 !important;
  min-width: 0 !important;
  width: 100%;
}
.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.cropper-wrap-box {
  overflow: hidden;
}
.cropper-drag-box {
  opacity: 0;
  background-color: #fff;
}
.cropper-modal {
  opacity: 0.5;
  background-color: #000;
}
.cropper-view-box {
  display: block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
}
.cropper-dashed {
  position: absolute;
  display: block;
  opacity: 0.5;
  border: 0 dashed #eee;
}
.cropper-dashed.dashed-h {
  top: 33.33333%;
  left: 0;
  width: 100%;
  height: 33.33333%;
  border-top-width: 1px;
  border-bottom-width: 1px;
}
.cropper-dashed.dashed-v {
  top: 0;
  left: 33.33333%;
  width: 33.33333%;
  height: 100%;
  border-right-width: 1px;
  border-left-width: 1px;
}
.cropper-center {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 0;
  height: 0;
  opacity: 0.75;
}
.cropper-center:before,
.cropper-center:after {
  position: absolute;
  display: block;
  content: ' ';
  background-color: #eee;
}
.cropper-center:before {
  top: 0;
  left: -3px;
  width: 7px;
  height: 1px;
}
.cropper-center:after {
  top: -3px;
  left: 0;
  width: 1px;
  height: 7px;
}
.cropper-face,
.cropper-line,
.cropper-point {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}
.cropper-face {
  top: 0;
  left: 0;
  background-color: #fff;
}
.cropper-line {
  background-color: #39f;
}
.cropper-line.line-e {
  top: 0;
  right: -3px;
  width: 5px;
  cursor: e-resize;
}
.cropper-line.line-n {
  top: -3px;
  left: 0;
  height: 5px;
  cursor: n-resize;
}
.cropper-line.line-w {
  top: 0;
  left: -3px;
  width: 5px;
  cursor: w-resize;
}
.cropper-line.line-s {
  bottom: -3px;
  left: 0;
  height: 5px;
  cursor: s-resize;
}
.cropper-point {
  width: 5px;
  height: 5px;
  opacity: 0.75;
  background-color: #39f;
}
.cropper-point.point-e {
  top: 50%;
  right: -3px;
  margin-top: -3px;
  cursor: e-resize;
}
.cropper-point.point-n {
  top: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize;
}
.cropper-point.point-w {
  top: 50%;
  left: -3px;
  margin-top: -3px;
  cursor: w-resize;
}
.cropper-point.point-s {
  bottom: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: s-resize;
}
.cropper-point.point-ne {
  top: -3px;
  right: -3px;
  cursor: ne-resize;
}
.cropper-point.point-nw {
  top: -3px;
  left: -3px;
  cursor: nw-resize;
}
.cropper-point.point-sw {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize;
}
.cropper-point.point-se {
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  opacity: 1;
}
@media (min-width: 768px) {
  .cropper-point.point-se {
    width: 15px;
    height: 15px;
  }
}
@media (min-width: 992px) {
  .cropper-point.point-se {
    width: 10px;
    height: 10px;
  }
}
@media (min-width: 1200px) {
  .cropper-point.point-se {
    width: 5px;
    height: 5px;
    opacity: 0.75;
  }
}
.cropper-point.point-se:before {
  position: absolute;
  right: -50%;
  bottom: -50%;
  display: block;
  width: 200%;
  height: 200%;
  content: ' ';
  opacity: 0;
  background-color: #39f;
}
.cropper-invisible {
  opacity: 0;
}
.cropper-bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}
.cropper-hide {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
}
.cropper-hidden {
  display: none !important;
}
.cropper-move {
  cursor: move;
}
.cropper-crop {
  cursor: crosshair;
}
.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
</style>
```
