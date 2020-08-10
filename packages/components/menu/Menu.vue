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
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    skin: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    expand: {
      type: Array,
      default: ()=>[],
    },
    expandAll: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: 'vertical',
      validator(val){
        return ['horizontal', 'vertical'].indexOf(val) > -1
      }
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
    this.setChildrenDirection()
  },
  methods: {
    hasOpened() {
      this.$children.every((item) => {
        if (item.isActive) this.isActive = true;
        return true;
      });
      return false;
    },
    expandAllMenu(){
      this.$children.forEach((val,idx)=>{  
        if(val.$children.length>0 && val.$options.name == "jeSubMenu"){
          val.isExpand = true
          val.defaultStatus = true
        }
      })
    },
    expandMenu(){
      if(this.expand.length==0) return;
      this.expand.forEach((v,i)=>{
        this.$children.forEach((val,idx)=>{  
          if(idx == v && val.$children.length>0 && val.$options.name == "jeSubMenu"){
            val.isExpand = true
            val.defaultStatus = true
          }
        })
      }) 
    },
    setChildrenDirection(that){
      that = that || this;
      if(isVertical){
        that.$children.forEach((val,idx)=>{
          if(val.$options.name == "jeSubMenu"){
            val.direction = true
            this.setChildrenDirection(val)
          }
        })
      }
      
    }
  },
  computed: {
    menuClass(){
      let that = this;
      return [
        "je-menu",
        that.mode === 'vertical' ? 'je-menu-vertical' : 'je-menu-horizontal',
        that.skin, that.type
      ]
    }
  }
}
</script>
<style lang="less">
.je-menu{
  position: relative;display: flex;
  &.je-menu-horizontal{
    -webkit-box-orient: horizontal;flex-direction: column;
    .je-submenu{display: inline-block;}
  }
  &.je-menu-vertical{-webkit-box-orient: vertical;flex-direction: column;}
  &.float{
    position:absolute;left:100%;top:-30px;min-width:180px;background-color:#fff;border:1px solid #ddd;border-radius: 4px;padding-left: 0px;
    dd{display: block;}
    dd dl{padding-left: 20px;}
    dd h3{padding-left:6px}
  }


  .je-menu-item{
    width: 100%;
    &:hover{color: #409EFF;}
    .routine{padding: 12px 0;min-height: 20px;cursor: pointer;}
    .active{background-color: #ecf5ff;color: #409EFF;}
  }

  .je-menu-item-group{
    width: 100%;
    .item-group-title {padding: 5px 10px;font-size: 14px;margin-left: 20px;color: #999999; }
  } 
  .je-submenu{display: flex;}
  .je-submenu.vertical{-webkit-box-orient: vertical;flex-direction: column;}
  .je-submenu-title{padding:10px 15px;min-height: 20px;cursor: pointer;display:-webkit-box;display:flex;-webkit-box-align: center;box-align: center;-webkit-box-orient: vertical;box-orient: vertical;align-items:center;}
  .je-submenu-title .je-submenu-caption{-webkit-box-orient: vertical;-webkit-box-pack: center;flex: 1;}
  .je-submenu-title .arrows{transition: all .3s ease;transform: rotate(0);color: #999999;}
  .je-submenu-title .arrows.rotate{transform: rotate(180deg);}
  .je-submenu-content{position: relative;transition: all .3s ease-in-out;}
}
</style>
