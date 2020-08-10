<template>
  <div :class="directionClass" :style="{ cursor, userSelect }" @mousemove="dragMove" @mouseup="dragStop">
    <div class="je-split-pane" :style="panelStart">
      <slot name="start"></slot>
    </div>
    <div class="je-split-trigger"  @mousedown="dragStart"></div>
    <div class="je-split-pane" :style="panelEnd">
      <slot name="end"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "jeSplit",
    props: {
      percent: {
        type: Number,
        default: 30
      },
      split: {
        type: String,
        default: "horizontal",
        validator(value) {
          return ["horizontal", "vertical"].indexOf(value) > -1;
        }
      },
      min: {
        type: Number,
        default: 10
      },
      max: {
        type: Number,
        default: 90
      }
    },
    data() {
      return {
        direction: true,
        active: false,
        currValue: this.percent,
        startPos: 0,
        startSplit: 0
      };
    },
    created () {
      this.direction = this.split === 'horizontal' ? true : false
    },
    computed: {
      userSelect() {
        return this.active ? "none" : "";
      },
      cursor() {
        return this.active ? (this.direction ? "ew-resize" : "ns-resize") : "";
      },
      directionClass() {
        return ["je-split", `je-split-${this.split}`];
      },
      panelStart() {
        if (this.currValue < this.min) {
          this.currValue = this.min;
        }
        return this.direction ? {width: this.currValue + '%'} : {height: this.currValue + '%'}
      },
      panelEnd() {
        if (this.currValue > this.max) {
          this.currValue = this.max;
        }
        return this.direction ? {width: (100 - this.currValue) + '%'} : {height: (100 - this.currValue) + '%'}
      }
    },
    methods: {
      dragStart(e) {
        e.preventDefault();
        this.active = true;
        this.startPos = this.direction ? e.pageX : e.pageY;
        this.startSplit = this.currValue;
        e.stopPropagation();
      },
      dragMove(e) {
        if (this.active) {
          e.preventDefault();
          const dx = (this.direction ? e.pageX : e.pageY) - this.startPos;
          const totalSize = this.direction ? this.$el.offsetWidth : this.$el.offsetHeight;
          this.currValue = this.startSplit + Math.round((dx / totalSize) * 100);
          e.stopPropagation();
        }
      },
      dragStop(e) {
        if (this.active) {
          e.preventDefault();
          this.active = false;
          e.stopPropagation();
        }
      }
    }
  };

</script>

<style lang="less">
  .je-split {
    width: 100%;
    height: 100%;
    position: relative;

    .je-split-pane {
      height: 100%;
      display: flex;
      word-wrap: break-word;
      word-break: break-all;
      overflow: auto;
    }

    &.je-split-horizontal {
      display: -webkit-box;
      display: flex;
      box-orient: horizontal;
      flex-direction: row;

      .je-split-trigger {
        width: 10px;
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-top: none;
        border-bottom: none;
        cursor: ew-resize;
        display: -webkit-box;
        display: flex;
        box-orient: horizontal;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      .je-split-trigger::before,
      .je-split-trigger::after {
        width: 1px;
        height: 30px;
        border-left: 1px solid #ccc;
        content: "";
      }
      .je-split-trigger::after{margin-left: 2px;}
    }
    

    &.je-split-vertical {
      display: -webkit-box;
      display: flex;
      box-orient: vertical;
      flex-direction: column;

      .je-split-trigger {
        width: 100%;
        height: 12px;
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-left: none;
        border-right: none;
        cursor: ns-resize;
        display: -webkit-box;
        display: flex;
        box-orient: vertical;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .je-split-trigger::before,
      .je-split-trigger::after {
        width: 30px;
        height: 1px;
        border-top: 1px solid #ccc;
        content: "";
        // margin-top: 1px;
      }
      .je-split-trigger::after{margin-top: 2px;margin-bottom: 1px;}
    }
  }

</style>
