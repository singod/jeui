<template>
<div style="width:100%;"></div>
</template>

<script>
// https://github.com/iq9891/ieditor
// http://nicedit.com/download.php
// https://github.com/luosijie/vm-editor
// https://github.com/BetaSu/my-vue-editor/blob/master/src/editor/editor.js
// https://blog.csdn.net/zshsats/article/details/88561075
// https://github.com/remembergf/Rich-text-editor/blob/master/text.html
import JEditor from "./editor/editor.js";
export default {
  name: "jeEditor",
  props: {
    value: {
      type: String,
      default: '<p>请输入内容</p>'
    }
  },
  data() {
    return {
    }
  },
  computed: {
    editContent: {
      get(){
        return this.value
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.runEditor()
    })   
  },
  methods: {
    runEditor(){
      new JEditor({
        elem: this.$el,
        content: this.editContent,
        onChange: html => {
          // this.editContent = html     
          this.$emit('input', html)    
        },
      })
    }
  }

}
</script>


<style>
.je-editor {display: block;position: relative;border: 1px #e9e9e9 solid;}

.je-editor .je-editor-tools {position: relative;width: 100%;background-color: #f6f6f6;border-bottom: 1px #e9e9e9 solid;}

.je-editor .je-editor-tools .editor-btn {display: inline-block;min-width: 28px;height: 28px;line-height: 28px;padding: 0 8px;text-align: center;cursor: pointer;background-color: transparent;}
.je-editor .je-editor-tools .editor-btn.selected{color:blue;}

.je-editor .je-editor-body {position: relative;width: 100%;overflow-y: auto;display: block;height: 100%;}
.je-editor .editor-content {padding: 10px;;color: #333;border: 0;outline: 0;min-height: 100%;}
.je-editor .editor-content pre {background-color: #f1f1f1;border-radius: 4px;padding: 8px;margin:0 0 10px 0;}
.je-editor .editor-content a{color:#0000ff; text-decoration:underline;}
.je-editor .editor-content a:hover{color:#c00}
.je-editor .editor-content p{line-height: 24px;margin:0 0 8px 0;}
.je-editor .editor-content ol{display: block;}
.je-editor .editor-content ol li{ list-style-type:decimal;list-style-position:inside;}
.je-editor .editor-content ul{display: block;}
.je-editor .editor-content ul li{ list-style-type:disc;list-style-position:inside;}
.je-editor .editor-content img{display: inline-block; border: none; vertical-align: middle;}
.je-editor .editor-content blockquote {display: block;border-left: 4px solid #d0e5f2;padding: 5px 10px;margin:0 0 10px 0;line-height: 1.4;background-color: #f1f1f1;border-radius: 4px;}
.je-editor .editor-content table{border-collapse:collapse;border:none;margin:0 0 10px 0;}
.je-editor .editor-content table th{background-color: #f6f6f6;}
.je-editor .editor-content table th,.je-editor .editor-content table td{padding: 5px;position: relative;line-height: 22px;font-size: 14px;border: 1px solid #e0e0e0;}

.je-editor-dialog{position: fixed;border: 1px #e6e6e6 solid;background-color:#fff;display: none;overflow: hidden;z-index: 150;}
.je-editor-dialog.center{left: 50%;top: 50%;transform: translate(-50%,-50%);box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);border-radius: 4px;}
.je-editor-dialog .dialog-header{position: relative;width: 100%;height:34px;overflow: hidden;background-color: #f6f6f6;color:#000;border-bottom: 1px #e6e6e6 solid;}
.je-editor-dialog .dialog-header span{height:34px;line-height: 34px;display: block;padding-left: 10px;float: left;}
.je-editor-dialog .dialog-header em{width:34px;height:34px;line-height: 34px;text-align: center;display: block;float: right;color:#999;cursor: pointer;font-size: 14px;background-size: 16px 16px;background-position: center center;}
.je-editor-dialog .dialog-header em:hover{color:#c00;}
.je-editor-dialog .dialog-tabs{height: 30px;border-bottom: 1px solid #e6e6e6;padding: 0 10px;width: 100%;margin-bottom: 10px;}
.je-editor-dialog .dialog-tabs .dialog-tab{margin-right: 10px;cursor: pointer;}
.je-editor-dialog .dialog-tabs .dialog-tab.active{color: #57a3f3;}
.je-editor-dialog .dialog-body .tab-box{display: none;}
.je-editor-dialog .dialog-body{position: relative;padding: 10px;overflow: hidden;}
.je-editor-dialog .dialog-body .upload{border: none; line-height: 30px;}
.je-editor-dialog .dialog-body .input{width:100%;height:30px;line-height: 30px;border-bottom: 1px #e6e6e6 solid;border-radius: 4px;padding: 0 8px;display: flex;box-sizing: border-box;}
.je-editor-dialog .dialog-body .input:focus,
.je-editor-dialog .dialog-body .input:hover {border-color: #57a3f3;}
.je-editor-dialog .dialog-footer{position: relative;width: 100%;text-align: center;padding: 4px 0;}
.je-editor-dialog .dialog-footer button{height:26px;line-height: 24px;text-align: center;border-radius: 4px;cursor: pointer;margin:0 5px;padding: 0 10px;}
.je-editor-dialog .dialog-footer button.yes{background-color:#57a3f3;border: 1px #57a3f3 solid;color: #fff;}
.je-editor-dialog .dialog-footer button.no{background-color:#f6f6f6;border: 1px #ddd solid;color: #666;}
.je-editor-dialog .colors{width: 230px;}
.je-editor-dialog .colors li{width: 20px;height: 20px;float: left;margin: 1px;}
.jed-create {
  display: flex;
  margin-bottom: 10px;
}
.jed-create div {
  width: 60px;
  line-height: 30px;
}
.jed-create input {
  border: 1px solid #e6e6e6;
  /* text-align: center; */
}
</style>
