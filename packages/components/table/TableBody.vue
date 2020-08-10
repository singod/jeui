<template>
  <table cellspacing="0" cellpadding="0" border="0" class="je-table-wrap">
    <tbody v-if="data.length===0">
      <tr>
        <td :colspan="cols.length" class="empty"> {{emptyText}} </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr v-for="(row,index) in data" :key="index">
        <td v-for="(item,idx) in cols" :key="idx" :align="item.align" :style="setColWidth(item)">
          <TableTd :column="item" :row="row" :index="index" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
// import TableTd from './TableTd.vue'
const TableTd = {
  props: ['column', 'row', 'index', 'title'],
  render (h) {
    let row = this.row, column = this.column
    let $index = this.index, title = this.title
    if(column.$children.length>0){
      let fields = [], coleach = (function coleach(cols) {
        if( cols.$children.length>0){
          cols.$children.forEach(val => {
            fields.push(val.prop)   
            if(val.$children && val.$children.length>0){
              coleach(val)
            }
          });
        }
      })(column);
      column.prop = fields[fields.length-1];
    }
    let rescols = column.renders.call(this, h, {
      row, $index, column
    })
    return (<div class="cell">{ rescols }</div>)
  }
}

export default {
  name:"jeTableBody",
  props: {
    data: {
      type:Array,
      default:()=>[]
    }
  },
  components: {TableTd},
  data () {
    return {}
  },
  methods:{
    setColWidth(item){
      return this.$parent.setColWidth(item)
    }
  },
  computed: {
    cols () {
      return this.$parent.bodyColumns
    },
    colsFilter () {
      return this.$parent.columnsFilter
    },
    isExtend () {
      // 返回有没存在type=extend的列
      let extend = false
      this.cols.forEach(item => {
        if (item.type === 'extend') {
          extend = true
        }
      })
      return extend
    },  
  },
  render (h) {
    return h('div',this.$slots.default)
  }
}
</script>
