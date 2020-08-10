<template>
  <header class="je-layouts-header">
    <slot></slot>
  </header>
</template>

<script>
export default {
  name:"jeHeader"
}
</script>

<style>
.je-layouts-header{-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto}
.je-layouts-header {height:60px;line-height:60px;background-color:#fff;}
</style>
