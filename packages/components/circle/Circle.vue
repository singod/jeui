<template>
  <div :class="circleClass" :style="circleSize">
    <svg viewBox="0 0 100 100">
      <path
        :d="pathString"
        :stroke="trailColor"
        :stroke-width="trailWidth"
        :fill-opacity="0"
        :style="trailStyle"
      />
      <path
        :d="pathString"
        :stroke-linecap="strokeLinecap"
        :stroke="currValue == 100 ? '#5cb85c':strokeColor"
        :stroke-width="strokeWidth"
        :fill-opacity="0"
        :style="pathStyle"
      />
    </svg>
    <div class="je-circle-inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "jeCircle",
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    size: {
      type: [Number, String],
      default: "120"
    },
    strokeWidth: {
      type: Number,
      default: 6
    },
    trailWidth: {
      type: Number,
      default: 5
    },
    strokeColor: {
      type: String,
      default: "#2d8cf0"
    },
    trailColor: {
      type: String,
      default: "#eaeef2"
    },
    // 'square', 'round'
    strokeLinecap: {
      type: String,
      validator(val) {
        return ["square", "round"].indexOf(val) > -1;
      },
      default: "round"
    },
    // 是否显示为仪表盘
    dashboard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currValue: this.value
    };
  },
  watch: {
    value() {
      this.currValue = this.value;
    }
  },
  computed: {
    circleClass() {
      return ["je-circle"];
    },
    circleSize() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      };
    },
    radius() {
      return 50 - this.strokeWidth / 2;
    },
    pathString() {
      if (this.dashboard) {
        return `M 50,50 m 0,${this.radius}
        a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}
        a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}`;
      } else {
        return `M 50,50 m 0,-${this.radius}
        a ${this.radius},${this.radius} 0 1 1 0,${2 * this.radius}
        a ${this.radius},${this.radius} 0 1 1 0,-${2 * this.radius}`;
      }
    },
    circleLen() {
      return Math.PI * 2 * this.radius;
    },
    trailStyle() {
      let style = {};
      if (this.dashboard) {
        style = {
          "stroke-dasharray": `${this.circleLen - 75}px ${this.circleLen}px`,
          "stroke-dashoffset": `-${75 / 2}px`,
          transition:
            "stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s"
        };
      }
      return style;
    },
    pathStyle() {
      let style = {};
      if (this.dashboard) {
        style = {
          "stroke-dasharray": `${(this.currValue / 100) *
            (this.circleLen - 75)}px ${this.circleLen}px`,
          "stroke-dashoffset": `-${75 / 2}px`,
          transition:
            "stroke-dashoffset .3s ease 0s, stroke-dasharray .6s ease 0s, stroke .6s, stroke-width .06s ease .6s"
        };
      } else {
        style = {
          "stroke-dasharray": `${this.circleLen}px ${this.circleLen}px`,
          "stroke-dashoffset": `${((100 - this.currValue) / 100) *
            this.circleLen}px`,
          transition: "stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease"
        };
      }
      return style;
    }
  }
};
</script>

<style>
.je-circle {
  position: relative;
  display: inline-block;
}
.je-circle-inner {
  width: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  line-height: 1;
}
</style>
