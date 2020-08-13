<template>
  <div class="je-menu-item">
    <template v-if="isPaths">
      <router-link tag="p" class="routine" :to="path" :url="path" :style="itemStyle" exact>
        <slot></slot>
      </router-link>
    </template>
    <template v-else>
      <div
        class="routine"
        v-if="hasChildren"
        :class="{ 'je-menu-toggle': isActive,}"
        @click="toggle"
        :style="itemStyle"
      >
        <span class="text je-f14">
          <slot></slot>
        </span>
        <i :class="arrowClass"></i>
      </div>
      <div class="routine" v-else @click="click" :style="itemStyle">
        <span class="text je-f14">
          <slot></slot>
        </span>
      </div>
    </template>
    <div class="subset" v-if="isActive" :style="itemStyle">
      <slot name="sub"></slot>
    </div>
  </div>
</template>
<script>
import mixin from "./mixin";
import Icon from "../icon/Icon";
export default {
  name: "jeMenuItem",
  mixins: [mixin],
  props: {
    icon: {
      type: String,
      default: "",
    },
    path: {
      type: [String, Object],
      default: () => {
        return "";
      },
    },
    active: {
      type: Boolean,
      default: false,
    },
    click: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    Icon,
  },
  data() {
    return {
      toPath: this.path,
      isActive: this.active,
      hasChildren: false,
      arrowClass: "arrow-down",
      type: this.$parent.type,
    };
  },
  created() {
    // console.log(this.$parent)
  },
  mounted() {
    this.findParentComponents(this);
    this.hasChildren = !!this.$slots.sub;
    if (this.hasChildren) {
      this.getChildrenStatus();
      if (this.arrowClass === "arrow-right") {
        this.$el.addEventListener("mouseenter", this.toggle);
        this.$el.addEventListener("mouseleave", this.toggle);
      }
    }
  },
  methods: {
    toggle() {
      this.isActive = !this.isActive;
    },
    getChildrenStatus() {
      this.$children.every((item) => {
        if (item.isActive) this.isActive = true;
        if (item.type === "float") this.arrowClass = "arrow-right";
        return true;
      });
    },
    eventListener(type) {
      let event = type == "add" ? "addEventListener" : "removeEventListener";
      this.$el[event]("mouseenter", this.toggle);
      this.$el[event]("mouseleave", this.toggle);
    },
  },
  computed: {
    itemStyle() {
      let padVal =
        this.ParentLayerNum - 1 == 0 ? "" : 15 * this.ParentLayerNum + "px";
      return {
        paddingLeft: padVal,
      };
    },
    isPaths() {
      let keys = Object.keys(this.toPath);
      return this.toPath == "" || keys.length == 0 ? false : true;
    },
  },
  beforeDestroy() {
    this.$el.removeEventListener("mouseenter", this.toggle);
    this.$el.removeEventListener("mouseleave", this.toggle);
  },
};
</script>


