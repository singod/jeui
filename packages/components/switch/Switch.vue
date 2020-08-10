<template>
  <label :class="switchClass" @click="toggleSwitch" :style="wrapStyles">
    <span class="je-switch-inner">
      <slot name="open" v-if="checkStatus"></slot>
      <slot name="close" v-if="!checkStatus"></slot>
    </span>
    <input type="hidden" :name="name" :value="checkStatus">
  </label>
</template>


<script>
export default {
  name: 'jeSwitch',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    trueValue: {
      type: [String, Number, Boolean],
      default: true
    },
    falseValue: {
      type: [String, Number, Boolean],
      default: false
    },
    trueColor: {
      type: String
    },
    falseColor: {
      type: String
    },
    size: String,
    name: {
      type: String
    },
  },
  data () {
    return {
      checkStatus: this.value
    }
  },
  methods: {
    toggleSwitch () {
      if (this.disabled) return
      this.checkStatus = !this.checkStatus
      this.$emit('change', this.checkStatus)
    }
  },
  computed: {
    switchClass(){
      return [
        'je-switch',
        {
          ['je-switch-disabled']: this.disabled,
          ['je-switch-checked']: this.checkStatus
        }
      ]
    },
    wrapStyles () {
      let style = {};
      if (this.trueColor && this.checkStatus === this.trueValue) {
        style['background-color'] = this.trueColor;
      } else if (this.falseColor && this.checkStatus === this.falseValue) {
        style['background-color'] = this.falseColor;
      }
      return style;
    }
  }
}
</script>

<style lang="less">
.je-switch{
  min-width: 40px;
  height: 20px;
  position: relative;
  display: inline-block;
  border-radius: 20px;
  background-color: #bfbfbf;
  vertical-align: middle;
  cursor: pointer;

  .je-switch-inner {
    color: #fff;
    font-size: 12px;
    padding-left: 22px;
    padding-right: 6px;
    line-height: 20px;
    display: block;
  }

  &:before {
    content: "";
    display: block;
    position: absolute;
    left: 2px;
    top: 50%;
    margin-top: -8px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #fff;
    transition: all .3s ease-in-out;
  }

  &.je-switch-checked {
    background-color: #409EFF;
    
    &::before{
      left: 100%;
      margin-left: -18px;
      transition: all .3s ease-in-out;
    }

    .je-switch-inner{
      padding-left: 6px;
      padding-right: 22px;
    }
  }
}
</style>
