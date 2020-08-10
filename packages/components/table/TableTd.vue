<script>
export default {
  name: 'jeTableTd',
  data () {
    return {

    }
  },
  props: ['column','width', 'row', 'index', 'title'],
  methods: {
    
  },
  render (h) {
    let row = this.row, column = this.column
    let $index = this.index, title = this.title
    let classNameTd = column.fixed
    if (column.className && column.fixed) {
      classNameTd += ' ' + column.className
    } else if (column.className) {
      classNameTd = column.className
    }
    if(column.$children.length>0){
      let fields = [], coleach = (function coleach(cols) {
        if( cols.$children.length>0){
          cols.$children.forEach(c => {
            fields.push(c.prop)   
            if(c.$children && c.$children.length>0){
              coleach(c)
            }
          });
        }
      })(column);
      column.prop = fields[fields.length-1];
    }
    let rescols = column.renders.call(this, h, {
      row, column, $index,
    })
    return (<td class={classNameTd} align={column.align} title={title || column.title ? row[column.prop] : null}>
    <div class="cell">
      { rescols }
    </div></td>)
  }
}
</script>

