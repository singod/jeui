<template>
  <section :class="wrapClasses">
    <slot></slot>
  </section>
</template>

<script>
import {findComponentDownward, findComponentsDownward } from '../../utils/findComponent'
export default {
  name:"jeLayout",
  props:{},
  data(){
    return {
      hasSider: false
    }
  },
  computed: {
    wrapClasses () {
      return [
        'je-layouts',
        this.hasSider ? 'je-layouts-has-sider' : ''
      ];
    }
  },
  methods: {
    findSider () {
      for(let i=0; i<this.$children.length; i++){
        let child = this.$children[i]
        if(child.$options.name === 'jeSider'){
          this.hasSider = true
          return
        }
      }
    }
  },
  mounted ()  {
    this.findSider();
  }
}
</script>

<style>
.je-layouts,.je-layouts * {-webkit-box-sizing:border-box;box-sizing:border-box}
.je-layouts {height: 100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-webkit-flex:auto;-ms-flex:auto;flex:auto;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;min-height:0;background:#f0f2f5}
.je-layouts.je-layouts-has-sider {-webkit-box-orient: horizontal;-webkit-box-direction: normal;flex-direction: row;}
</style>
