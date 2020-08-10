<template>
  <div :class="stepClass">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'jeStep',
    props: {
      current: {
        type: Number,
        default: 0,
        validator(val){
          return val >= 0
        }
      },
      status: {
        type: String,
        default: 'process',
        validator(val){
          return ['wait', 'process', 'finish', 'error'].indexOf(val) > -1
        }
      },
      size: {
        type: String,
        default: 'default',
        validator(val){
          return ['default', 'small'].indexOf(val) > -1
        }
      },
      direction: {
        type: String,
        default: 'horizontal',
        validator(val){
          return ['horizontal', 'vertical'].indexOf(val) > -1
        }
      }
    },
    data() {
      return {
        steps: []
      }
    },
    watch: {
      current() {
        this.updateStatus()
      },
      steps(vals) {
        vals.forEach((step, index) => {
          step.stepIndex = index;
        })
        this.updateStatus()
      }
    },
    mounted() {
      this.updateStatus()
    },
    methods: {
      updateStatus() {
        let that = this, current = that.current, status = that.status;
        that.steps.forEach((child, index) => {
          const prevChild = that.steps[index - 1]
          if (index === current) {
            if (status === 'error') {
              child.internalStatus = 'error'
              prevChild && (prevChild.nextError = true)
            } else {
              child.internalStatus = 'process'
            }
          } else if (index < current) {
            child.internalStatus = 'finish'
          } else {
            child.internalStatus = 'wait'
          }
          if (child.finalStatus !== 'error' && prevChild) {
            prevChild.nextError = false
          }
        })
      }
    },
    computed: {
      stepClass(){
        let that = this;
        return [
          'je-step', 
          that.direction === 'vertical' ? 'je-step-vertical' : 'je-step-horizontal',
          that.size === 'small' ? 'je-step-small' : ''
        ]
      }
    },
  }

</script>

<style lang="less">
.je-step{
  width: 100%;line-height: 1.5;position: relative;display:-webkit-box;display: -ms-flexbox;display: flex;

  &.je-step-horizontal{
    box-orient: horizontal;flex-direction: row;flex-wrap: wrap;
    .je-step-item{
      position: relative;display:-webkit-box;display: -ms-flexbox;display: flex;flex: 1;box-orient: vertical;flex-direction: column;flex-wrap: wrap;
      padding-right: 10px;
      .je-steps-mark{
        display:-webkit-box;display:flex;-webkit-box-align: center;box-align: center;-webkit-box-orient: vertical;box-orient: vertical;align-items:center;
        .stepicon{width:24px;height: 24px;line-height:22px;text-align: center; display: block;border-radius: 100%;border-width: 1px;border-style: solid;}
        .steptext{padding:0 10px;font-size: 14px;font-weight: bold;}
        &::after {
          content: '';height: 1px;border-bottom-width: 1px;border-bottom-style: solid;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-pack: center;flex: 1;
        } 
      }
      .je-steps-desc{width:100%;flex: 1;padding:5px 0 0 34px;}
      &:last-child .je-steps-mark::after{display: none;}
    }
  }

  &.je-step-vertical{
    box-orient: vertical;flex-direction: column;flex-wrap: wrap;
    .je-step-item{
      width:100%;position: relative;flex: 1;
      .je-steps-mark{
        width:100%;display:-webkit-box;display: -ms-flexbox;-webkit-box-align: center;
        .stepicon{width:24px;height: 24px;line-height:22px;text-align: center; display: block;border-radius: 100%;border-width: 1px;border-style: solid;}
        .steptext{padding:0 10px;font-size: 14px;font-weight: bold;}
      }
      .je-steps-desc{width:100%;flex: 1;padding:5px 0 20px 34px;}
      &::after {
        content: '';width:1px;border-left-width: 1px;border-left-style: solid;position: absolute;top:30px;left:11px;bottom: 6px;
      }
      &:last-child::after{display: none;}
    }
  }

  .je-step-item{
    &.je-step-process{
      .stepicon{color:#fff;border-color:#2d8cf0;background-color:#2d8cf0;}
      .je-steps-mark::after{border-bottom-color: #e0e0e0;}
      &::after{border-left-color: #e0e0e0;}
    } 

    &.je-step-finish{
      .stepicon{color:#2d8cf0;border-color:#2d8cf0;}
      .steptext{color:#2d8cf0;}
      .je-steps-mark::after{border-bottom-color: #2d8cf0;}
      &::after{border-left-color: #2d8cf0;}
    } 

    &.je-step-error{
      .stepicon{color:#ff4949;border-color:#ff4949;}
      .steptext{color:#ff4949;}
      .je-steps-mark::after{border-bottom-color: #ff4949;}
      &::after{border-left-color: #ff4949;}
    } 

    &.je-step-wait{
      .stepicon{color:#aaa;border-color:#aaa;}
      .steptext{color:#aaa;}
      .je-steps-mark::after{border-bottom-color: #e0e0e0;}
      &::after{border-left-color: #e0e0e0;}
    } 
  }
}
</style>
