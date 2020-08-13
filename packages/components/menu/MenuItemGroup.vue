<template>
  <div class="je-menu-item-group">
    <template>
      <div class="item-group-title">
        <slot name="title"></slot>
      </div>
    </template>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "jeMenuItemGroup",
  props: {
    name: {
      type: String,
    },
  },
  data() {
    return {
      vertical: false,
      textColor: null,
      activeColor: null,
      activeBackGroundColor: null,
    };
  },
  methods: {
    childClosePopover() {
      if (this.$parent.$options.name === "jeSubMenu") {
        this.open = false;
        this.$parent.childClosePopover();
      }
    },
    tellChilcVertical() {
      this.$children.forEach((child) => {
        child.vertical = true;
        if (
          child.$options.name === "jeSubMenu" ||
          child.$options.name === "jeMenuItemGroup"
        ) {
          child.tellChilcVertical();
        }
      });
    },
    tellChildrenColor(bc) {
      this.$children.forEach((child) => {
        if (this.activeColor) {
          child.activeColor = this.activeColor;
        }
        if (this.activeBackGroundColor) {
          child.activeBackGroundColor = this.activeBackGroundColor;
        }
        child.textColor = this.textColor;
        if (child.$options.name === "jeSubMenu") {
          child.tellChildrenColor(bc);
          if (bc) {
            child.backGroundColor = bc;
          }
        }
        if (child.$options.name === "jeMenuItemGroup") {
          child.tellChildrenColor(bc);
          if (bc) {
            child.backGroundColor = bc;
          }
        }
      });
    },
  },
};
</script>
