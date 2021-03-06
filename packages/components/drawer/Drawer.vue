<template>
  <div class="je-drawer" :class="{opendrawer:visible}">
    <div class="mask" @click="hideMask" :style="[maskStyle,{zIndex:zIndex}]"></div>
    <div class="wrap" :class="orien" :style="{width:drawerWidth,zIndex:zIndex+5}">
      <header class="drawer-head" v-if="$slots.header">
        <slot name="header"></slot>
      </header>
      <main class="drawer-content">
        <slot v-html="content"></slot>
      </main>
      <footer class="drawer-foot" v-if="$slots.footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script scoped>
  export default {
    name: "jeDrawer",
    props: {
      value: {
        type: Boolean,
        default: false
      },
      orien: {
        type: String,
        default: "left"
      },
      zIndex: {
        type: Number,
        default: 1000
      },
      width: {
        type: Number,
        default: 300
      },
      maskClose: {
        type: Boolean,
        default: true
      },
      maskStyle: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    data() {
      return {
        drawerWidth: "0",
        visible: this.value
      };
    },
    created() {
      this.drawerWidth = this.width <= 100 ? this.width + "%" : this.width + "px";
    },
    watch: {
      value(val) {
        this.visible = val;
      },
      visible(val) {
        this.$emit("on-open", val);
      }
    },
    methods: {
      close() {
        this.handleClose();
      },
      hideMask() {
        if (this.maskClose) {
          this.handleClose();
        }
      },
      handleClose() {
        this.visible = false;
        this.$emit("input", false);
        this.$emit("on-close", false);
      }
    }
  };

</script>

<style scoped>
  .je-drawer {
    position: relative;
    overflow: hidden;
  }

  .je-drawer .mask {
    position: fixed;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    background: rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity 0.38s, width 0.1s 0.38s, height 0.1s 0.38s;
  }

  .je-drawer.opendrawer .mask {
    width: 100%;
    height: 100%;
    opacity: 1;
    transition: opacity 0.38s;
  }

  .je-drawer .wrap {
    position: fixed;
    top: 0;
    height: 100%;
    background: #ffffff;
    transition: all 0.38s;
    display: flex;
    flex-direction: column;
    background-clip: padding-box;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .je-drawer .wrap .drawer-head {
    color: #333;
    display: flex;
    padding: 12px 10px;
    width: 100%;
    border-bottom: 1px solid #e8eaec;
    line-height: 1;
    font-size: 16px;
  }

  .je-drawer .wrap .drawer-content {
    overflow: auto;
    flex: 1;
    padding: 10px;
  }

  .je-drawer .wrap .drawer-foot {
    color: #333;
    display: flex;
    padding: 10px;
  }

  .je-drawer .wrap.left {
    left: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .je-drawer .wrap.right {
    right: 0;
    transform: translate3d(100%, 0, 0);
  }

  .je-drawer.opendrawer .wrap.left,
  .je-drawer.opendrawer .wrap.right {
    transform: translate3d(0, 0, 0);
  }

</style>
