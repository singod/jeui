<template>
  <transition name="notify-fade" @after-leave="doDestory">
    <div class="je-notify je-flex je-align-center" :style="notifyStyle" v-show="showNotify">
      <Icon :type="iconClass" :custom="'je-flex je-mr8 je-'+(type=='error'?'danger':type)" :size="26" v-if="showIcon"></Icon>
      <div class="je-notify-content je-flex je-vertical je-justify-center">
        <h3 class="je-show je-f16" v-if="title" v-text="title"></h3>
        <div class="je-show je-c6" v-if="message" v-html="message"></div>
      </div>
      <Icon type="icon-close" custom="je-notify-close je-c9" :size="16" v-show="showClose" @click="handleClose"></Icon>
    </div>
  </transition>
</template>

<script>
let notzIndex = 10086;
import Icon from '../icon/Icon.vue'
export default {
  name: "jeNotify",
  props:{
    visible:{
      type: Boolean,
      default: false
    },
    type:{
      type: String,
      default: ''
    },
    title:{
      type: String,
      default: ''
    },
    message:{
      type: String,
      default: ''
    },
    time:{
      type: Number,
      default: 4
    },
    showClose:{
      type: Boolean,
      default: true
    },
    onClose: Function,
  },
  data() {
    return {
      showNotify: false,
      zIndex: 0,
      top: null,
      timer: null,
      closed: false
    }
  },
  components:{
    Icon
  },
  watch: {
    showCloseIcon(val) {
      console.log(val)
      val ? this.showClose = true : this.showClose = false
    },
    closed(val) {
      if (val) {
        this.showNotify = false
      }
    }
  },
  computed: {
    iconClass() {
      const classArr = {
        success: 'icon-check',
        error: 'icon-close',
        warning: 'icon-roundwarn',
        info: 'icon-hint',
      }
      return this.icon !== '' ? this.icon : classArr[this.type];
    },
    notifyStyle(){
      return {
        top: this.top ? `${this.top}px` : 'auto',
        zIndex: this.zIndex
      }
    },
    showIcon() {
      return this.type
    }
  },
  methods: {
    doDestory() {
      this.$destroy(true)
      this.$el.remove();
    },
    handleClose() {
      this.closed = true
      if (typeof this.onClose === 'function') {
        this.onClose()
      }
    },
    startTimer() {
      let that = this;
      that.zIndex = notzIndex++;
      that.showNotify = that.visible;
      if (that.time > 0) {
        that.timer = setTimeout(() => {
          !that.closed && that.handleClose()
        }, that.time * 1000)
      }
    },
    clearTimer() {
      clearTimeout(this.timer)
    }
  },
  mounted() {
    document.body.appendChild(this.$el);
    this.startTimer()
  }
}

</script>

<style>
.je-notify {
  position: fixed;
  right: 16px;
  width: 320px;
  padding: 6px 12px;
  color: #3f536e;
  background-color: #fff;
  border: 1px #e9e9e9 solid;
  line-height: 1.5;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  -webkit-transition: opacity .3s, top .4s, -webkit-transform .3s;
  transition: opacity .3s, top .4s, -webkit-transform .3s;
  transition: opacity .3s, transform .3s, top .4s;
  transition: opacity .3s, transform .3s, top .4s, -webkit-transform .3s;
}

.je-notify-content {
  flex: 1;
  padding-right: 8px
}
.je-notify-content h3{font-weight: 700;}
.je-notify-close{position: absolute;top:8px;right:8px;padding: 4px;cursor: pointer;}
</style>
