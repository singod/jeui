<template>
  <div class="je-conwrap" :class="auto?'auto':'bespread'" :style="{width: width}">
    <div class="je-block-wrap" :class="shadow?'shadow':''">
      <div class="je-block-head" v-if="$slots.header"><slot name="header"></slot></div>
      <div class="je-block-body"><slot></slot></div>
      <div class="je-block-foot" v-if="$slots.footer"><slot name="footer"></slot></div>
    </div>
  </div>
</template>

<script>
export default {
  name:"JeWrap",
  props:{
    width: {
      type: String,
      default: '100%'
    },
    auto:{
      type: Boolean,
      default: true
    },
    shadow:{
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
    }
  }
}
</script>


<style>
.je-conwrap{box-sizing: border-box;-webkit-box-flex: 1;flex: auto;padding: 15px;margin-left:auto;margin-right:auto;}
.je-conwrap.bespread{height: 100%;flex-direction: column;display: flex;}
.je-conwrap.auto{height: auto;}

.je-conwrap .je-block-wrap{box-sizing: border-box;-webkit-box-flex: 1;flex: auto;border-radius: 3px;background-color: #fff;}
.je-conwrap .je-block-wrap.shadow{box-shadow:0 0px 5px rgba(0,0,0,.15);}
.je-conwrap .je-block-head{min-height: 40px;line-height: 40px;border-bottom: 1px solid #F3F3F3;position: relative;}
.je-conwrap .je-block-body{display: block;text-align: left;overflow-x: hidden;}
.je-conwrap.bespread .je-block-wrap{height: 100%;flex-direction: column;display: flex;}
.je-conwrap.bespread .je-block-body{flex: 1;}
.je-conwrap .je-block-foot{min-height: 40px;line-height: 40px;position: relative;}
</style>

