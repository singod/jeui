<template>
  <main class="je-layouts-content">
    <slot></slot>
  </main>
</template>

<script>
export default {
  name:"jeContent"
}
</script>

<style>
.je-layouts-content {-webkit-box-flex:1;-webkit-flex:auto;-ms-flex:auto;flex:auto;min-height:0;overflow-y: auto;}
</style>
