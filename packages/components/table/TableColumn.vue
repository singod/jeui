<script>
  export default {
    name: `jeTableColumn`,
    data() {
      return {
        renders: {}
      }
    },
    props: {
      prop:{
        type:String,
        default:""
      },
      label:{
        type:String,
        default:""
      },
      width:{
        type:[String,Number],
        default:""
      },
      minWidth:{
        type:[String,Number],
        default:""
      },
      className: {
        type: String,
        default: ''
      },
      align: {
        type: String,
        // 对齐方式，可选left/center/right
        validator: function (value) {
          return ['left', 'center', 'right'].indexOf(value) !== -1
        }
      },
      type: {
        type: String,
        // 可选selection（多选）/index序号
        validator: function (value) {
          return ['selection', 'index', 'extend'].indexOf(value) !== -1
        }
      },
      fixed: {
        type: String,
        // 固定当前列，可选left/right
        validator: function (value) {
          return ['left', 'right'].indexOf(value) !== -1
        }
      },
      sortBy: {
        // 当前列显示排序按钮
        type: Boolean,
        default: false
      },
      title: {
        // 鼠标滑过单元格时是否显示title提示语
        type: Boolean,
        default: false
      }
    },
    created() {
      this.renders = (h, { row, column, $index }) => {
        let children = null
        if (this.$scopedSlots.default) {
          const data = {
            row: row,
            index: $index + 1,
          }
          if(column.$children.length==0){
            return this.$scopedSlots.default(data)
          }
        }
        if (column.type === 'selection') {
          // 如果selectedRows有当前行，则为选中状态
          let className = 'je-table-check'
          if (this.$parent.selectedRows.indexOf(row) !== -1) {
            className += ' checked'
          }
          return h('label', {
            attrs: {class: className},
            on: {
              click: this._handleChange.bind(this, row)
            }
          }, [
            h('span', {class: 'je-table-check-inner'},[h('input',{attrs:{type:'checkbox',hidden:'false'}})])
          ])
        }
        if (column.type === 'index') {
          // return h('div', style, $index + 1)
          return $index + 1
        }
        return row[column.prop]
        
      }
    },
    methods: {
      _handleChange(row) {
        this.$parent.handleChange(row)
      }
    },
    render(h) {
      return h('div',this.$slots.default);
    }
  }

</script>
