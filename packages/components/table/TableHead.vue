<template>
  <table class="je-table-wrap" cellspacing="0" cellpadding="0" border="0">
    <thead>
      <tr v-for="(vals,idx) in headColumns" :key="idx">
        <th v-for="(item,index) in vals" :key="index"
        :rowspan="idx ==0 ? item.rowspan : ''" 
        :colspan="idx ==0 ? item.colspan : ''" 
        :align="item.align" :style="setColWidth(item)">
          <div class="cell" v-if="item.type=='selection'">
          <label class="je-table-check" :class="selectClass" @click="handleSelectAll">
            <span class="je-table-check-inner"></span>
          </label>
          </div>
          <div class="cell" v-else-if="item.type=='index'">{{item.label}}</div>
          <div class="cell" v-else>{{item.label}}</div>
        </th>
      </tr>
    </thead> 
  </table>
</template>

<script>
export default {
  name: 'jeTableHead',
  props: {
    columns: {
      type: Array,
      default: () => {}
    },
    selectClass: {
      type:String,
      default:''
    },
  },
  methods: {
    setColWidth(item){
      return item.last ? this.$parent.setColWidth(item) : ''
    },
    handleSelectAll(){
      this.$parent.handleSelectAll()
    }
  },
  computed: {
    headColumns(){
      return this.$parent.headColumns
    }
  }
}
</script>
