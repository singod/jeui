<!--
 * @Description: 穿梭框
--> 
<template>
  <div class="je-transfer-panel">
    <div class="transfer-panel-header">
      <je-checkbox v-model="allChecked"
                   @change="handleAllChecked"
                   :disabled="!data.length || !filteredCheck.length"
                   :indeterminate="isIndeterminate">
        {{ title }}
        <span class="label">{{ checkedStatistic }}</span>
      </je-checkbox>
    </div>
    <div class="transfer-panel-body">
      <div class="transfer-panel-filter" v-if="isFilter">
        <je-input v-model="keyWords" clearable prefix="icon-search" width="100%" :placeholder="placeholder"></je-input>
      </div>
      <je-checkbox-group :class="['transfer-panel-list', { 'is-filter': isFilter }]" v-model="checkList" @change="handleChange">
        <template v-for="item in filteredList">
          <je-checkbox class="transfer-panel-item"
                       :label="item[keyProp]"
                       :disabled="item[disabledProp]"
                       :key="item[keyProp]">
            {{ item[labelProp] }}
          </je-checkbox>
        </template>
      </je-checkbox-group>
    </div>
  </div>
</template>

<script>
import JeCheckbox from '../checkbox/Checkbox';
import JeCheckboxGroup from '../checkbox/CheckboxGroup';
import JeInput from '../input/Input';

export default {
  components: {
    JeCheckbox,
    JeCheckboxGroup,
    JeInput
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    title: String,
    replace: Object,
    isFilter: Boolean,
    placeholder: String,
    filterMethod: Function,
    defaultCheck: Array
  },
  computed: {
    labelProp() {
      return this.replace.label || 'label';
    },
    keyProp() {
      return this.replace.key || 'key';
    },
    disabledProp() {
      return this.replace.disabled || 'disabled';
    },
    // 搜索
    filteredList() {
      return this.data.filter(item => {
        if (typeof this.filterMethod === 'function') {
          return this.filterMethod(this.keyWords, item)
        } else {
          return item[this.labelProp].includes(this.keyWords);
        }
      })
    },
    checkedStatistic() {
      const checkLength = this.checkList.length;
      const dataLength = this.filteredList.length;
      return `${checkLength}/${dataLength}`
    },
    // 过滤所有禁用的项
    filteredCheck() {
      return this.data.filter(item => !item[this.disabledProp]);
    },
    isIndeterminate() {
      const checkLength = this.checkList.length;
      return checkLength > 0 && checkLength < this.filteredCheck.length;
    }
  },
  data() {
    return {
      allChecked: false,
      checkList: [],
      keyWords: '',
      checkChangeByUser: true, // 判断勾选是否来自用户的操作
      // isIndeterminate: false
    }
  },
  watch: {
    checkList(val, oldVal) {
      if (this.checkChangeByUser) {
        this.$emit('checkChange', val, true);
      } else {
        this.checkChangeByUser = true
        this.$emit('checkChange', val);
      }
      // console.log(val.length > 0 && val.length < this.data.length, this.data)
      if (val.length && val.length === this.filteredCheck.length) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
    },
    data() {
      let checkList = [];
      const checkData = this.data.map(item => item[this.keyProp]);
      this.checkList.forEach(item => {
        if (checkData.indexOf(item) > -1) {
          checkList.push(item);
        }
      })
      this.checkList = checkList;
      // this.allChecked = false;
      this.checkChangeByUser = false;
    },
    defaultCheck: {
      immediate: true,
      handler(val, oldVal) {
        if (oldVal && val.length === oldVal.length && val.every(item => oldVal.indexOf(item) > -1)) return;
        const checkData = this.filteredCheck.map(item => item[this.keyProp]);
        let checkList = [];
        val.forEach(item => {
          if (checkData.indexOf(item) > -1) {
            checkList.push(item);
          }
        })
        this.checkChangeByUser = false;
        this.checkList = checkList;
        // if (checkList.length === this.data.length) {
        //   this.allChecked = true;
        // }
        // console.log(checkList, this.data)
      }
    }
  },
  methods: {
    // 全选
    handleAllChecked(val) {
      this.checkList = val ? this.filteredCheck.map(item => item[this.keyProp]) : [];
      // this.isIndeterminate = false;
    },
    // 列表change事件
    handleChange(val) {
      this.$emit('checkChange', val);
    },
    // 单选项
    // handleItemChecked(val) {
      // this.allChecked = val.length === this.filteredCheck.length;
      // console.log(this.allChecked)
      // this.isIndeterminate = val.length > 0 && val.length < this.data.length;
    // }
  }
};
</script>
