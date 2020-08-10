<template>
  <div class="je-collapse" :class="{ 'je-collapse-simple': simple }">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'jeCollapse',
  props: {
    accordion: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Array, String, Number]
    },
    simple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currValue: this.value
    }
  },
  created(){
    this.currValue = this.valueCheck(this.value)
  },
  watch: {
    value (val) {
      this.currValue = this.valueCheck(val)
    },
    currValue () {
      this.setActive()
    }
  },
  methods: {
    setActive () {
      let activeKey = this.getActiveKey(),
        accordion = this.accordion
      this.$children.forEach((item, index) => {
        const name = item.name || index.toString()
        if (accordion) {
          item.isActive = activeKey[0] === name
        } else {
          item.isActive = activeKey.indexOf(name) >= 0
        }
        item.index = index
      })
    },
    getActiveKey () {
      let activeKey = this.currValue || []
      if (!Array.isArray(activeKey)) {
        activeKey = [activeKey]
      }
      if (this.accordion && activeKey.length > 1) {
        activeKey = [activeKey[0].toString()]
      } else {
        let i = activeKey.length
        while (i--) {
          activeKey[i] = activeKey[i].toString()
        }
      }
      return activeKey
    },
    toggle (itemData) {
      let name = itemData.name.toString(),
        newActiveKey = []
      if (this.accordion && !itemData.isActive) {
        newActiveKey.push(name)
      } else {
        let activeKey = this.getActiveKey(),
          nameIndex = activeKey.indexOf(name)
        if (itemData.isActive && nameIndex >= 0) {
          activeKey.splice(nameIndex, 1)
        } else if (nameIndex < 0) {
          activeKey.push(name)
        }
        newActiveKey = activeKey
      }
      this.currValue = newActiveKey
      this.$emit('onChange', this.currValue)
    },
    valueCheck (val) {
      return typeof val === 'number' ? `${val}` : val
    }
  },
  mounted () {
    this.setActive()
  }
}
</script>

<style lang="less">
.je-collapse {
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  overflow: hidden;
  .je-collapse-item{
    border-bottom: 1px solid #dfdfdf;
    .je-collapse-header {
      height: 38px;
      line-height: 38px;
      padding-left: 16px;
      color: #666;
      cursor: pointer;
      position: relative;
      border-bottom: 1px solid transparent;
      transition: all .2s ease-in-out;
    }
    .je-collapse-body{
      will-change: height;
    }
    .je-collapse-content {
      padding: 16px;
      color: #3f536e;
      border-radius: 0 0 4px 4px;
      background-color: #fff;
      overflow: hidden;
    }
    &:last-child{border-bottom:none;}
  }
}
</style>

