<template>
  <div class="je-dropdown">
    <div class="je-dropdown-title" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave" @click.stop="handleClick" @contextmenu.prevent="handleRightClick">
      <slot></slot>
    </div>
    <slot v-bind="$attrs" :style="openStyle" name="dropDown"></slot>
  </div>
</template>

<script>
  import {setElementSize} from "../../utils/dom";
  import {findComponentDownward} from "../../utils/findComponent";
  export default {
    name: 'jeDropDown',
    props:{
      trigger:{
        type:String,
        default:"hover"
      },
      zIndex:{
        type:Number,
        default:9999
      }
    },
    data() {
      return {
        visible:false,
        openStyle:{},
      }
    },
    mounted() {
      this.$on("drop-down-click", this.dropDownMenu);
    },
    methods: {
      dropDownMenu(command, instance){
        this.$emit('command', command, instance);
      },
      handleMouseenter() {
        if(this.trigger == "hover"){
          if (this.timeout) clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.handleMenu(true)
          }, 50);
        }
      },
      handleMouseleave() {
        if(this.trigger == "hover"){
          if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              this.handleMenu(false)
            }, 50);
          }
        }
      },
      handleClick(){
        if(this.trigger == "click"){
          this.handleMenu(true)
        }
      },
      handleRightClick(){
        if(this.trigger == "contextMenu"){
          this.handleMenu(true)
        }
      },
      handleMenu(isShow){
        let dropDown = findComponentDownward(this,'jeDropDownMenu')
        dropDown.visible = isShow;
        if(isShow){
          // 将元素插入到Body中
          // document.body.appendChild(dropDown.$el)
          this.$nextTick(()=>{
            let down =  setElementSize(this.$el,dropDown.$el)
            dropDown.openStyle = Object.assign({zIndex: 9999},{width:'auto',top:down.top,left:down.left})
            document.addEventListener('click', (e) => {
              this.concealPanel(e, dropDown.$el)
            }, false) 
          })
        }else{
          document.removeEventListener('click', (e) => {
            this.concealPanel(e, dropDown.$el)
          }, false)
        }
      },
      //点击除弹出层外的空白区域隐藏面板
      concealPanel (e, elem) {
        e.stopPropagation();
        if (elem && !elem.contains(e.target)) {
          this.handleMenu(false)
        }
      },
    },
    destroyed () {
      document.removeEventListener('click', (e) => {
        this.concealPanel(e, dropDown.$el)
      }, false)
    }
  }

</script>

<style>
/* dropdown */
.je-dropdown{display: inline-block;position: relative;}
.je-dropdown .je-dropdown-title{font-size:14px;display:block;overflow: hidden;position: relative;cursor: default;position: relative;text-overflow:ellipsis; white-space:nowrap;color: #333;-webkit-transition: border-color .15s cubic-bezier(.65,.05,.35,.5);transition: border-color .15s cubic-bezier(.65,.05,.35,.5);-webkit-box-sizing: border-box!important;-moz-box-sizing: border-box!important;box-sizing: border-box!important;}
.je-dropdown-content{max-height: 226px;border:1px solid #dadada;border-radius:4px;background-color:#fff;box-shadow: 0 0 5px rgba(0,0,0,.2);position: fixed;overflow: hidden;left: 0;top:36px;transform-origin: center top 0px;}
.je-dropdown-content::before {
  display: none;
  content: "";
  position: absolute;
  top: 15px;
  left: 78px;
  width: 0;
  height: 0;
  transform: rotate(45deg);
  border: 8px solid #fff;
  box-shadow: 0 0 4px #aaa;
}
.je-dropdown-content dl{min-width: 100px;display: block;padding: 4px 0;font-size:14px;overflow: auto;}
.je-dropdown-content dl dd{padding: 0 8px;height: 36px;line-height: 36px;text-overflow:ellipsis; white-space:nowrap;overflow: hidden;cursor: pointer;}
.je-dropdown-content dl dd:hover{background-color: #F3F3F3;}
.je-dropdown-content dl dd.disabled{color: #bbbbbb;cursor: not-allowed;}
.je-dropdown-content dl dd.disabled:hover{background-color: #ffffff;}
</style>
