<template>
  <div class="je-badge">
    <slot></slot>
    <sup v-show="show && (currValue || currValue > 0 || dot)" :class="supClass" v-text="currValue"></sup>
  </div>
</template>

<script>
export default {
  name: "jeBadge",
  props: {
    value: {
      type: [Number, String],
      default: "",
    },
    max: {
      type: Number,
      default: 0,
    },
    show: {
      type: Boolean,
      default: true,
    },
    dot: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "danger",
    },
  },
  data() {
    return {
      currValue: 0,
    };
  },
  created() {
    this.currValue = this.showContent();
  },
  watch: {
    value() {
      this.currValue = this.value;
    },
  },
  computed: {
    supClass() {
      let that = this;
      return [
        {
          fixed: that.$slots.default,
          dot: that.dot,
          [`je-bg-${that.type}`]: that.type != "",
          [`je-border-white`]: that.type != "",
        },
        that.type == "default" ? "je-c3" : "je-white",
      ];
    },
  },
  methods: {
    showContent() {
      if (this.dot) return;
      let value = this.value || 0,
        max = this.max;
      if (value > 0 && max > 0) {
        return max < value ? `${max}+` : value;
      }
      return value;
    },
  },
};
</script>

<style>
.je-badge {
  position: relative;
  vertical-align: middle;
  display: inline-block;
}
.je-badge sup {
  border-radius: 20px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 20px;
  line-height: 19px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
}
.je-badge sup.fixed {
  position: absolute;
  top: 0;
  right: 10px;
  transform: translateY(-50%) translateX(100%);
}
.je-badge sup.dot {
  height: 10px;
  width: 10px;
  padding: 0;
  top: 0;
  right: 5px;
  border-radius: 50%;
}
</style>
