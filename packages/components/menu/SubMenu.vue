<template>
  <div class="je-submenu vertical">
    <h3
      class="je-submenu-title"
      v-if="$slots.title"
      @mouseenter="openMenu"
      @mouseleave="closeMenu"
      @click="toggleMenu"
      :style="itemStyle"
    >
      <div class="je-submenu-caption">
        <slot name="title"></slot>
      </div>
      <Icon custom="je-f14 je-fr arrows" :class="isExpand ? 'rotate' : ''" type="icon-movedown"></Icon>
    </h3>
    <FoldAnimate>
      <div class="je-submenu-content" v-show="isExpand">
        <slot></slot>
      </div>
    </FoldAnimate>
  </div>
</template>

<script>
import FoldAnimate from "../../utils/foldAnimate";
import mixin from "./mixin";
import Icon from "../icon/Icon.vue";
export default {
  name: "jeSubMenu",
  mixins: [mixin],
  data() {
    return {
      isExpand: false,
      defaultStatus: false,
      ParentLayerNum: 0,
      contentStyle: {},
    };
  },
  components: {
    Icon,
    FoldAnimate,
  },
  watch: {},
  created() {},
  mounted() {
    this.findParentComponents(this);
  },
  methods: {
    openMenu() {},
    closeMenu() {},
    toggleMenu() {
      let that = this,
        height = "0px",
        timer,
        conTimer;
      that.isExpand = !that.isExpand;
    },
    findParentComponents(val) {
      let parent = val.$parent,
        opts = parent.$options;
      if (parent && (opts.name == "jeSubMenu" || opts.name == "jeMenu")) {
        this.ParentLayerNum = this.ParentLayerNum + 1;
        this.findParentComponents(parent);
      }
    },
  },
  computed: {
    itemStyle() {
      return {
        paddingLeft:
          this.ParentLayerNum - 1 == 0 ? "" : 15 * this.ParentLayerNum + "px",
      };
    },
  },
};
</script>


