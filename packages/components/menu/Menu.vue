<template>
  <div :class="menuClass" :style="{width:width}">
    <slot></slot>
  </div>
</template>
<script>
let isVertical = false;
export default {
  name: "jeMenu",
  props: {
    width: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    skin: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    expand: {
      type: Array,
      default: () => [],
    },
    expandAll: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "vertical",
      validator(val) {
        return ["horizontal", "vertical"].indexOf(val) > -1;
      },
    },
  },
  data() {
    return {
      typeClass: this.type,
      isActive: false,
    };
  },
  mounted() {
    // this.direction = this.mode == 'vertical' ? true : false;
    this.expandAll ? this.expandAllMenu() : this.expandMenu();
    this.setChildrenDirection();
  },
  methods: {
    hasOpened() {
      this.$children.every((item) => {
        if (item.isActive) this.isActive = true;
        return true;
      });
      return false;
    },
    expandAllMenu() {
      this.$children.forEach((val, idx) => {
        if (val.$children.length > 0 && val.$options.name == "jeSubMenu") {
          val.isExpand = true;
          val.defaultStatus = true;
        }
      });
    },
    expandMenu() {
      if (this.expand.length == 0) return;
      this.expand.forEach((v, i) => {
        this.$children.forEach((val, idx) => {
          if (
            idx == v &&
            val.$children.length > 0 &&
            val.$options.name == "jeSubMenu"
          ) {
            val.isExpand = true;
            val.defaultStatus = true;
          }
        });
      });
    },
    setChildrenDirection(that) {
      that = that || this;
      if (isVertical) {
        that.$children.forEach((val, idx) => {
          if (val.$options.name == "jeSubMenu") {
            val.direction = true;
            this.setChildrenDirection(val);
          }
        });
      }
    },
  },
  computed: {
    menuClass() {
      let that = this;
      return [
        "je-menu",
        that.mode === "vertical" ? "je-menu-vertical" : "je-menu-horizontal",
        that.skin,
        that.type,
      ];
    },
  },
};
</script>
