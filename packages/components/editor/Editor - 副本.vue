<template>
  <div class="je-editor">
    <div class="je-editor-tools" ref="toolbar">
      <template v-for="(item,index) in menus">
        <button :key="index" @click="command(item.value)" type="button" class="editor-btn">{{item.name}}</button>
      </template>
    </div>
    <div class="je-editor-body">
      <div class="editor-content" contenteditable="true" ref="content" 
      ></div>
    </div>
  </div>
</template>

<script>
// https://github.com/iq9891/ieditor
// http://nicedit.com/download.php
// https://github.com/luosijie/vm-editor
// https://github.com/BetaSu/my-vue-editor/blob/master/src/editor/editor.js
export default {
  name: "jeEditor",
  props: {
    content: {
      type: String,
      default: "<p><br></p>"
    }
  },
  data() {
    return {
      menus: [
        {name: "加粗", value: "bold"},
        {name: "复制", value: "copy"},
        {name: "剪切", value: "cut"},
        {name: "插入水平线", value: "inserthorizontalrule"},
        {name: "有序列表", value: "insertorderedlist"},
        {name: "无序列表", value: "insertunorderedlist"},
        {name: "倾斜", value: "italic"},
        {name: "居中对齐", value: "justifycenter"},
        {name: "两端对齐", value: "justifyfull"},
        {name: "左对齐", value: "justifyleft"},
        {name: "右对齐", value: "justifyright"},
        {name: "清除样式", value: "removeformat"},
        {name: "下划线", value: "underline"}
      ]
    }
  },
  watch: {
    content(val){
      console.log(val)
    }
  },
  mounted() {  
    const content = this.$refs.content
    const toolbar = this.$refs.toolbar
    if(content.innerHTML == ''){
      content.innerHTML = this.content
    }
    
    document.addEventListener('mouseup', e => {
      this.saveCurrentRange()
    }, false)
    content.addEventListener('keyup', e => {
      this.$emit('change', content.innerHTML)
      this.saveCurrentRange()
    }, false)
    content.addEventListener('paste', e => {
      document.execCommand('paste', e, true)
    })
    
  },
  methods: {
    preventEnter(evt) {
      if(evt.keyCode==13){
        //屏蔽默认回车，插入换行符
        if(!!window.ActiveXObject || "ActiveXObject" in window){
          document.createRange().pasteHTML('<p><br></p>')
        }else{
          this.command("insertHTML", '<p><br></p>');
        }
      } 
    },
    command(type, value = null){
      document.execCommand('StyleWithCSS',true,true)
      document.execCommand(type, true, value)
    },
    saveCurrentRange(){
      const selection = window.getSelection ? window.getSelection() : document.getSelection()
      const content = this.$refs.content
      if (!selection.rangeCount || !content) {
        return
      }
      for (let i = 0; i < selection.rangeCount; i++) {
        const range = selection.getRangeAt(0)
        let start = range.startContainer
        let end = range.endContainer
        // for IE11 : node.contains(textNode) always return false
        start = start.nodeType === Node.TEXT_NODE ? start.parentNode : start
        end = end.nodeType === Node.TEXT_NODE ? end.parentNode : end
        if (content.contains(start) && content.contains(end)) {
          this.range = range
          break
        }
      }
    },
  },
}
</script>

<style>
.je-editor{display: block;position: relative;border: 1px #e9e9e9 solid;}
.je-editor .je-editor-tools{position: relative;width:100%;background-color: #f6f6f6;border-bottom: 1px #e9e9e9 solid;}
.je-editor .je-editor-tools .editor-btn{display: inline-block;min-width:24px;height: 24px;line-height: 24px;padding: 0 5px;text-align: center;cursor: pointer;background-color: transparent;}
.je-editor .je-editor-body{position: relative;width:100%;}
.je-editor .editor-content{margin: 10px;display: block;overflow: hidden;min-height: 60px;border: 0;outline: 0;}
</style>
