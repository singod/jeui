<template>
  <div class="je-table">
    <div class="je-table-box" :style="{width:width,height:tableHeight}">
      <div class="hidden-column" ref="hiddenColumns"><slot></slot></div>
      <div class="je-table-header" :style="{paddingRight:barWidth + 'px'}">
        <div class="je-table-thead" ref="headwrap">
          <TableHead :columns="columns" :selectClass="selectChecked" :style="{width:totalWidth + 'px'}"></TableHead>
        </div>
      </div>     
      <div class="je-table-body" ref="bodywrap" :style="{height:bodyHeight}">
        <TableBody :data="tableData" :style="{width:totalWidth + 'px'}"></TableBody>
      </div>
      <div class="je-table-fixed left" v-if="leftData.length>0" v-show="leftShadow"
        :style="{bottom: (botScroll?barWidth:1) + 'px'}">
        <div class="je-table-thead" :style="{width:leftWidth + 'px'}">
          <TableHead :columns="columns" :selectClass="selectChecked" :style="{width:totalWidth + 'px',float:'left'}"></TableHead>
        </div>
        <div class="je-table-body" :style="{width:leftWidth + 'px'}" ref="leftfixbody">
          <TableBody :data="tableData" :style="{width:totalWidth + 'px',float:'left'}"></TableBody>
        </div>
      </div>
      <div class="je-table-fixed right" v-if="rightData.length>0" v-show="rightShadow"
        :style="{bottom: (botScroll?barWidth:1) + 'px',right:barWidth + 'px'}">
        <div class="je-table-thead" :style="{width:rightWidth + 'px'}">
          <TableHead :columns="columns" :selectClass="selectChecked" :style="{width:totalWidth + 'px',float:'right'}"></TableHead>
        </div>
        <div class="je-table-body" :style="{width:rightWidth + 'px'}" ref="rightfixbody">
          <TableBody :data="tableData" :style="{width:totalWidth + 'px',float:'right'}"></TableBody>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TableHead from './TableHead.vue'
import TableBody from './TableBody.vue'

export default {
  name:"jeTable",
  props:{
    width:{
      type: [String,Number],
      default: '100%'
    },
    height:{
      type: [String,Number],
      default: ''
    },
    data:{
      type: [Array,String],
      default:()=>[]
    },
    checkbox:false,
    radio:false,
    emptyText: {
      type: String,
      default: '暂无数据'
    },
  },
  components: {
    TableHead,
    TableBody,
  },
  data () {
    return {
      columns:[],
      columnsFilter: [], // 表头，过滤掉扩展列的
      selectedRows: [], // 已选择的行
      selectChecked: 'unSelect', // 全选状态 unSelect为全不选，someSelect选择了部分，checked全选
      leftData:[],
      leftWidth: 0,
      rightData:[],
      rightWidth: 0,
      tableWidth:"",
      tableHeight:"",
      totalWidth:0,
      allWidth:0,
      fixedWidth:0,
      surplusWidth:0,
      surplusLength:0,
      barWidth:0,
      totalPer:{},
      bodyHeight:"",
      botScroll:false,
      leftShadow:false,
      rightShadow:true,
      selectAllClick:null, // 全选/返选
      maxLine:1, //表头总共占的行数
      headColumns: [],
      bodyColumns: [],
    }
  },
  mounted () {
    let that = this
    setTimeout(()=>{
      let headHeight = that.$refs.headwrap.offsetHeight
      if(/^\d+$/.test(that.height)){
        that.tableHeight = that.height + "px"
        that.bodyHeight = (that.height - headHeight) + "px"
      }else{
        that.tableHeight = that.height
      }
      if(that.allWidth <= that.$el.clientWidth){
        that.rightShadow = false;
      }
      that.$refs.hiddenColumns.remove()
    },10)
    that.getAllCellWidth()
    that.resize()
  },
  computed: {
    tableData: {
      get() {
        return this.data
      },
    },
  },
  methods: {
    getAllCellWidth(){
      let that= this
      that.$nextTick(()=>{
        let childs = that.$children;
        let columns = [], leftWidth = 0, rightWidth = 0;
        // 遍历子组件，只返回column组件
        childs.forEach(child => {
          if(child.$options.name === 'jeTableColumn'){
            let fixWidth = 0, minWidth = 0
            if(child.width){
              fixWidth = child.width;  // 最大长度
            }else if(child.minWidth){
              minWidth = child.minWidth; // 最小长度
            }else{
              minWidth = 80;   // 默认最小长度
            }
            let objs = {
              label: child.label || '',
              prop: child.prop || '',
              align: child.align || '',
              width: fixWidth || '',
              minWidth: minWidth || '',
              fixed: child.fixed || '',
              type: child.type || '',
              title: child.title || '',
              renders: child.renders,
              $children: child.$children || [],
            }
            columns.push(objs)
            if(child.fixed == 'left'){
              that.leftData.push(objs)
              leftWidth += objs.width
            }
            if(child.fixed == 'right'){
              that.rightData.push(objs)
              rightWidth += objs.width
            }
          }
        });
        that.$set(that,'leftWidth',leftWidth-1)
        that.$set(that,'rightWidth',rightWidth-1)
        // 返回过滤掉扩展列的
        that.columnsFilter = childs.filter(item => {
          return item.$options.name === 'jeTableColumn' && item.type !== 'extend'
        })
        
        that.columns = columns
        that.setColumnSort(columns)      
        that.maxLine = that.headerRowspan(that.$children)
        that.columnsHandle(columns)
      })
    },
    setColumnSort(data){
      let that = this, cols = []
      const forColumn = (childs) => {
        childs.forEach(child => {
          if(child.$children && child.$children.length>0){
            forColumn(child.$children)
          }else{
            if(child.width){
              that.fixedWidth += child.width
            }else{
              that.surplusWidth += child.minWidth
              that.surplusLength += 1
            }
            cols.push(child)
          }           
        })
      }
      forColumn(data)
      that.allWidth = that.fixedWidth + that.surplusWidth;
      that.bodyColumns = cols
      that.calcWidth()
    },
    headerColspan(items) {
      let max = 0;
      (function getMaxCol(data) {
        if (max < data.length) {
          max = data.length;
        }
        data.forEach((item) => {
          if (item.$children) {
            getMaxCol(item.$children);
          }
        });
      })(items);
      return max;
    },
    headerRowspan(children){
      let that= this, max = 0;
      (function getMaxLine(childs, floor){
        childs.forEach(child => {
          if(child.$options.name === 'jeTableColumn'){
            if (floor > max) max = floor;
            if(child.$children && child.$children.length>0){
              getMaxLine(child.$children, floor + 1)
            }           
          }
        })
      })(children, 1);
      return max
    },
    columnsHandle(treeData) {
      const that = this, maxFloor = this.maxLine;
      that.headColumns.push([])
      const colsEach = (data, index) => {
        if (that.headColumns[index] === undefined) {
          that.headColumns[index] = [];
        }
        data.forEach((item) => {    
          item.last = false    
          if (item.$children && item.$children.length>0) {
            item.colspan = that.headerColspan(item.$children);
            item.rowspan = maxFloor - that.headerRowspan(item.$children);
            colsEach(item.$children, index + 1);
          }else{
            item.rowspan = maxFloor
            item.colspan = 1
            item.last = true
          }
          that.headColumns[index].push(item);
        })
      }
      colsEach(treeData, 0);
    },
    calcWidth(){
      let that= this, totalWidth = 0;
      that.barWidth = that.getScrollbarWidth()
      if(that.allWidth >= that.$el.clientWidth){
        totalWidth = that.allWidth + 1
        that.botScroll = true
      }else{
        totalWidth = that.$el.clientWidth - that.surplusLength - that.barWidth + 1
      }
      that.totalWidth = totalWidth;
      // 计算实际百分比值
      let pers = that.percount(that.bodyColumns, totalWidth-that.fixedWidth), 
        meanVal = (100 - pers[0])/that.surplusLength;
      that.totalPer = pers[1];
      for(let k in that.totalPer){
        that.totalPer[k] =  that.totalPer[k] + meanVal
      }
      that.handleScroll();
    },
    resize() {
      let that= this;
      window.addEventListener('resize',function(){
        that.calcWidth();
        that.handleScroll();
        that.rightShadow = (that.allWidth <= that.$el.clientWidth) ? false : true;
      },false)
    },
    // 设置每列的宽度
    setColWidth(item){
      return item.minWidth && item.minWidth != '' ? {minWidth:parseInt(item.minWidth-1)+'px'} 
      : {width:parseInt(item.width-1)+'px'}
    },
    // 根据最小宽度计算百分比
    percount(arr,surplus){
      let objs = {}, total = 0;
      arr.forEach((val,i)=>{
        if(val.minWidth && val.minWidth > 0){
          let fixVal = parseInt(val.minWidth)/surplus * 100;
          objs[''+i+''] = parseInt(fixVal);
          total += parseInt(fixVal)
        }
      });
      return [total,objs];
    },
    // 获取浏览器滚动条的宽度
    getScrollbarWidth() {
      let sdiv = document.createElement('div'),//创建一个div
        styles = {
          width: '100px',
          height: '100px',
          overflowY: 'scroll'//让他有滚动条
        }, i, barWidth, barHeight;
      for (i in styles) sdiv.style[i] = styles[i];
      document.body.appendChild(sdiv);   //把div添加到body中
      barWidth = sdiv.offsetWidth - sdiv.clientWidth;
      barHeight = sdiv.offsetHeight - sdiv.clientHeight;
      sdiv.remove();//移除创建的div
      return barWidth;//返回滚动条宽度
    },
    // 设置滚动条值
    handleScroll(){
      let that = this, bodyWrap = that.$refs.bodywrap;
      bodyWrap.addEventListener('scroll',(ev)=>{
        ev.stopPropagation(); 
        let tagLeft = ev.target.scrollLeft, tagTop = ev.target.scrollTop
        if(that.leftData.length>0){
          that.$refs.leftfixbody.scrollTop =  tagTop;
          that.leftShadow = tagLeft > 0 ? true : false;
        } 
        if(that.rightData.length>0){
          that.$refs.rightfixbody.scrollTop =  tagTop;
          if(bodyWrap.scrollWidth - tagLeft === bodyWrap.clientWidth){
            that.rightShadow = false;
          }else{
            that.rightShadow = true
          }
        } 
        that.$refs.headwrap.scrollLeft =  tagLeft;
      })           
    },
    getSelectAll() {
      return this.selectedRows
    },
    clearSelection () {
      let that = this;
      // 用于多选表格，清空用户的选择
      that.selectedRows.splice(0, that.selectedRows.length)
      that.selectChecked = 'unSelect'
    },
    toggleAllSelection() {
      let that = this;
      // 用于多选表格，切换所有行的选中状态
      that.selectedRows = [...that.tableData]
      that.selectChecked = 'checked'
    },
    toggleRowSelection(row, selected) {
      let that = this;
      // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）row, selected
      const index = that.selectedRows.indexOf(row)
      if (selected === false) {
        // 取消勾选当前行
        if (index !== -1) that.selectedRows.splice(index, 1)
      } else {
        // 勾选当前行，没有时添加。有时不重复添加
        if (index === -1) that.selectedRows.push(row)
      }
    },
    handleSelectAll() {
      let that = this;
      if (that.selectChecked === 'checked') {
        that.clearSelection()
      } else {
        that.toggleAllSelection()
      }
      that.selectAllClick && that.selectAllClick(that.selectedRows)
    },
    selectStatus() {
      let that = this;
      // 全选或返选状态
      if (that.selectedRows.length === that.tableData.length) {
        that.selectChecked = 'checked'
      } else {
        that.selectChecked = that.selectedRows.length > 0 ? 'someSelect' : 'unSelect';
      }
    },
    handleChange(row) {
      let that = this;
      // 提供给column引用 ，单选行时
      // 单选checkbox，选中时将当前行信息存入selectedRows，没勾选时删除
      const index = that.selectedRows.indexOf(row)
      if (index !== -1) {
        that.selectedRows.splice(index, 1);
      } else {
        that.selectedRows.push(row);
      }
      // 全选时将selectAll也选上
      that.selectStatus();
      that.selectClick && that.selectClick(row);
    }
  }
}
</script>

