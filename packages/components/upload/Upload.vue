<template>
  <div class="je-upload" :style="uploadStyle">
    <div class="je-upload-select">
      <div class="je-upload-ondrag" @drop.prevent="onDrop" @dragover.prevent="dragOver = true" @dragleave.prevent="dragOver = false" :class="{active:dragOver}" @click="handleClick" v-if="drag">
        <div class="dragicon">
          <Icon type="icon-cloud-upload" size="50px" />
        </div>
        <div class="dragtips">
          <slot>将文件拖到此处，或 <em style="color: #409eff;">点击上传</em></slot>
        </div>
      </div>
      <div class="je-dib" v-if="$scopedSlots.default">
        <slot :select="handleClick" :upload="onUpload" :files="allFileList"></slot>
      </div>
    </div>
    <input ref="uploadfiles" hidden type="file" :name="name" @change="handleChange" :multiple="multiple" :accept="accept">
    <div class="je-upload-tips" v-if="$scopedSlots.tiptop">
      <slot name="tiptop"></slot>
    </div>
    <div class="je-upload-list">
      <template v-if="$scopedSlots.list && showType == 'custom'">
        <slot name="list" :select="handleClick" :upload="onUpload" :remove="handleRemove" :files="allFileList"></slot>
      </template>
      <template v-else>
        <div class="je-upload-image" v-if="showType == 'image'">
          <ul>
            <li class="image-item" v-for="(item,index) in allFileList" :key="index">
              <img :src="item.base64">
              <div class="mask">
                <Icon type="icon-zoom-in" size="16px" />
                <Icon type="icon-shanchu" size="16px" @click="handleRemove(item)" />
              </div>
            </li>
            <li class="upbtn" @click="handleClick" v-if="!isLimit">
              <span>
                <Icon type="icon-normal-add" size="30px" />
              </span>
            </li>
          </ul>
        </div>
        <div class="je-upload-file" v-if="showType == 'list'">
          <ul>
            <li v-for="(item,index) in allFileList" :key="index">
              <div class="file-item">
                <Icon type="icon-docs" size="16px" />
                <p>&nbsp; {{item.name}}</p>
                <Icon type="icon-normal-close" size="16px" @click="handleRemove(item)" />
              </div>
              <div class="file-item" v-if="item.status !== 'success'">
                <p class="progress-inner">
                  <em class="progress-bg" :style="{width:item.percentage+'%'}"></em>
                </p>
                <span>{{item.percentage}}%</span>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="showType == 'no'" style="display:none;"></div>
      </template>
    </div>
    <div class="je-upload-tips" v-if="$scopedSlots.tipbottom">
      <slot name="tipbottom"></slot>
    </div>
  </div>
</template>

<script>
import UploadAjax from './ajax'
import Icon from '../icon/Icon'
export default {
  name: 'jeUpload',
  components: {
    Icon
  },
  props: {
    width: {
      type: String,
      default: 'auto'
    },
    height: {
      type: String,
      default: ''
    },
    // 上传地址
    action: {
      type: String,
      default: ''
    },
    // 上传请求 header 数据
    headers: {
      type: Object,
      default() {
        return {}
      }
    },
    // 是否支持多选文件
    multiple: {
      type: Boolean,
      default: false
    },
    // 附加请求的参数
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    // input标签的 name 属性
    name: {
      type: String,
      default: 'file'
    },
    // 是否拖拽上传
    drag: {
      type: Boolean,
      default: false
    },
    // 显示类型
    showType: {
      type: String,
      default: 'image',
      validator(val) {
        return ['custom', 'image', 'list', 'no'].indexOf(val) > -1
      }
    },
    limit: Number,
    // 支持发送 cookie 凭证信息
    withCredentials: {
      type: Boolean,
      default: false
    },
    // h5原生属性，接受上传的文件类型，即打开上传框时默认选择的类型
    accept: {
      type: String
    },
    // 支持的文件类型，与 accept 不同的是，format 是识别文件的后缀名，accept 为 input 标签原生的 accept 属性，会在选择文件时过滤，可以两者结合使用
    format: {
      type: Array,
      default() {
        return []
      }
    },
    // 文件大小限制，单位 kb
    maxSize: {
      type: Number
    },
    beforeUpload: Function,
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否自动上传
    autoUpload: {
      type: Boolean,
      default: true
    },
    request: {
      type: Function,
      default: UploadAjax
    },
    onProgress: {
      type: Function,
      default() {
        return {}
      }
    },
    onSuccess: {
      type: Function,
      default() {
        return {}
      }
    },
    onError: {
      type: Function,
      default() {
        return {}
      }
    },
    onExceed: {
      type: Function,
      default() {
        return {}
      }
    },
    onRemove: {
      type: Function,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dragOver: false,
      allFileList: [],
      tempList:[],
      upIndex: 1,
      fileIndex: 1,
      isLimit: false
    }
  },
  watch: {
    fileList: {
      immediate: true,
      handler(fileList) {
        this.allFileList = fileList.map(item => {
          item.status = 'finished'
          item.percentage = 100
          item.uid = new Date().getTime() + this.upIndex++
          return item
        })
      }
    }
  },
  methods: {
    handleClick() {
      if (!this.disabled){
        this.$refs.uploadfiles.value = null
        this.$refs.uploadfiles.click()
      }
    },
    handleChange(e) {
      const files = e.target.files
      if (!files) return
      this.uploadFiles(files)
    },
    onDrop(e) {
      this.dragOver = false
      if (this.disabled) return
      this.uploadFiles(e.dataTransfer.files)
    },
    uploadFiles(files) {
      let postFiles = Array.prototype.slice.call(files),
        before = null
      if (this.limit && this.allFileList.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.allFileList)
        return
      }
      this.isLimit = this.limit && this.allFileList.length + files.length == this.limit ? true : false
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1)
      }

      if (postFiles.length > 0) {
        this.tempList = []
        postFiles.forEach((file, index) => {
          this.handleStart(file)
        })
        if (typeof this.beforeUpload == 'function') {
          before = new Promise((resolve, reject) => {
            return this.beforeUpload(resolve, reject)
          })
        }
        if (this.autoUpload) {
          setTimeout(()=>{
            this.$refs.uploadfiles.value = null
            this.onUpload()
          },10)
        }
        
      }
    },
    handleStart(files) {
      this.base64File(files, {
        status: 'uploading',
        name: files.name,
        size: files.size,
        percentage: 0,
        base64: '',
        uid: new Date().getTime() + this.upIndex++,
        showProgress: true,
        file: files
      })
    },
    onUpload() {  
      let allFileList = this.autoUpload ? this.tempList : this.allFileList;
      allFileList.forEach(vals => {
        this.postUpload(vals.file)
      })
    },
    postUpload(files) {
      const options = {
        action: this.action||'', //上传路径
        headers: this.headers,
        file: files,
        data: this.data,
        fileName: this.name,
        withCredentials: this.withCredentials,
        onProgress: e => {
          this.handleProgress(e, files, this.allFileList)
        },
        onSuccess: res => {
          this.handleSuccess(res, files, this.allFileList)
        },
        onError: err => {
          this.handleError(err, files, this.allFileList)
        }
      }
      const req = this.request(options)
      if (req && req.then) {
        req.then(options.onSuccess, options.onError);
      }
    },
    getFile(file) {
      let target
      this.allFileList.every(item => {
        target = file.uid === item.uid ? item : null
        return !target
      })
      return target
    },
    handleProgress(e, file) {
      const _file = this.getFile(file)
      this.onProgress(e, _file, this.allFileList)
      _file.percentage = e.percent || 0
    },
    handleSuccess(res, file) {
      const _file = this.getFile(file)
      if (_file) {
        _file.status = 'success'
        _file.response = res
        this.onSuccess(res, _file, this.fileList)
        setTimeout(() => {
          _file.showProgress = false
        }, 1000)
      }
    },
    handleError(err, file, files) {
      const _file = this.getFile(files)
      const fileList = this.allFileList
      _file.status = 'error'
      fileList.splice(fileList.indexOf(_file), 1)
      this.onError(err, file, files)
    },
    handleRemove(file) {
      const fileList = this.allFileList
      fileList.splice(fileList.indexOf(file), 1)
      this.onRemove(file, fileList)
    },
    // 转图片转为base64，可在图片没上传完前先显示图片
    base64File(imgFile, objs) {
      let that = this
      if (/image\/\w+/.test(imgFile.type)) {
        // alert('请确保文件为图像类型')
        const reader = new FileReader()
        reader.readAsDataURL(imgFile)
        reader.onload = function(event) {
          objs.base64 = event.target.result
          that.allFileList.push(objs)
          that.tempList.push(objs)
        }
      }else{
        that.allFileList.push(objs)
        that.tempList.push(objs)
      }
    },
    checkFile(file) {
      const suffix = file.name
        .split('.')
        .pop()
        .toLocaleLowerCase()
      if (this.format) {
        if (this.format.indexOf(suffix) !== -1) {
        } else {
          let formats = this.format ? this.format.toString() : ''
          return '只支持上传类型为：' + formats
        }
      }
      if (this.maxSize && file.size > this.maxSize * 1024) {
        return `文件${file.name}超出最大${this.maxSize}kb上传限制`
      }
    },
    byToSize: function(bytes) {
      if (bytes === 0) return '0 B'
      let k = 1024, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k))
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
    },
    // 创建一个Blob对象 用于将base64转化为formdata
    dataURItoBlob(base64Data) {
      var byteString
      if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = window.atob(base64Data.split(',')[1])
      } else {
        byteString = unescape(base64Data.split(',')[1])
      }
      var mimeString = base64Data
        .split(',')[0]
        .split(':')[1]
        .split(';')[0] //type
      //处理异常,将ascii码小于0的转换为大于0
      var ab = new ArrayBuffer(byteString.length) //size
      var ia = new Uint8Array(ab)
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], { type: mimeString })
    }
  },
  computed: {
    uploadStyle() {
      return {
        width: this.width,
        height: this.height
      }
    }
  }
}
</script>

<style>
.je-upload {
  display: inline-block;
  position: relative;
}
.je-upload input[type='file'] {
  display: none;
}
.je-upload-select {
  display: block;
  position: relative;
}
.je-upload-ondrag {
  width: 100%;
  background-color: #fff;
  border: 1px #d3d3d3 dashed;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s ease;
  -webkit-box-pack: center;
  box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  box-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.je-upload-ondrag .dragicon {
  margin-top: 30px;
  color: #ccc;
}
.je-upload-ondrag .dragtips {
  margin-bottom: 30px;
}
.je-upload-ondrag:hover,
.je-upload-ondrag.active {
  border: 1px #409eff dashed;
}
.je-upload-tips {
  width: 100%;
  position: relative;
  display: block;
}
.je-upload-list {
  width: 100%;
  position: relative;
  overflow: hidden;
}
.je-upload-image {
  width: 100%;
  overflow: hidden;
}
.je-upload-image ul {
  width: 100%;
  display: block;
}
.je-upload-image ul li {
  position: relative;
  width: 80px;
  height: 80px;
  display: inline-block;
  overflow: hidden;
  border-radius: 4px;
}
.je-upload-image .image-item {
  border: 1px #ddd solid;
  margin-right: 10px;
}
.je-upload-image .image-item img {
  width: 100%;
  height: 100%;
}
.je-upload-image .image-item .mask {
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: none;
}
.je-upload-image .image-item .mask i {
  padding: 5px;
  cursor: pointer;
}
.je-upload-image .image-item:hover .mask {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #fff;
}
.je-upload-image .upbtn {
  border: 1px #d3d3d3 dashed;
  color: #ccc;
  cursor: pointer;
}
.je-upload-image .upbtn span {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.je-upload-image .upbtn:hover {
  border: 1px #409eff dashed;
}

.je-upload-file {
  width: 100%;
  overflow: hidden;
}
.je-upload-file li {
  width: 100%;
  position: relative;
  padding: 5px;
  border-radius: 4px;
  border: 1px #fff dashed;
  margin: 5px 0;
  display: inline-block;
  overflow: hidden;
}
.je-upload-file li:hover {
  background-color: #f6f6f6;
}
.je-upload-file .file-item {
  height: 18px;
  line-height: 18px;
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
  box-align: center;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  align-items: center;
}
.je-upload-file .file-item p {
  -webkit-box-flex: 1;
  flex: 1;
}
.je-upload-file .file-item p.progress-inner {
  width: 100%;
  height: 6px;
  background-color: #ececec;
  border-radius: 100px;
  margin-right: 8px;
}
.je-upload-file .file-item p .progress-bg {
  height: 6px;
  background-color: #19be6b;
  border-radius: 100px;
  display: block;
}
</style>
