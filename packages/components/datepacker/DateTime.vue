<template>
<div class="datepicker-content">
  <div class="datepicker-time" v-for="(times, index) in timeList" :key="index">
    <div class="time-head">{{showTimeText(timeText[index])}}</div>
    <div class="time-body">
      <div class="time-item" v-for="(item,idx) in times" :key="idx" ref="time" jeScroll>
        <p v-for="(t,ids) in item" :key="ids" :class="t.style" @click="selectTime(t,index)">{{t.value}}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Scrollbar from '../../utils/scrollbar.js'
export default {
  name: "DateTime",
  props: {
    date:{
      type: Array,
      default: () => []
    },
    select: {
      type: Array,
      default: () => []
    },
    multiPane: {
      type: Boolean,
      default: false
    },
    range: {
      type: String,
      default: ""
    },
    min: {
      type: String,
      default: ""
    },
    max: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      timeList: [],
      timeText: [],
      formathms:["hh","mm","ss"]
    }
  },
  mounted() {
    this.renderTime()
    this.$nextTick(() => {   
      Scrollbar.initAll();
      this.setScrollTop()
    })
  },
  methods: {
    renderTime() { 
      let hmsArr = [24,60,60], times = [];
      if(this.range === "") {
        times.push(this.date[0]);
      }else{
        times = this.date
      }
      let timeText = [], timeList = [];
      times.forEach((item, index) => {
        let array = [], objs = {}, select = this.select[index];
        hmsArr.forEach((val,s) => {
          let timeArr = [], hms = this.formathms[s];
          for (let t = 0; t < val; t++) {
            let hmsCls = "", dt = t < 10 ? "0" + (t | 0) : t;
            if(dt == select[hms]){
              hmsCls = "selected";
              objs[hms] = dt;
            }
            timeArr.push({style: hmsCls, value: dt, time: hms});
          }          
          array.push(timeArr);
        })
        timeText.push(objs);
        timeList.push(array);
      })
      this.timeList = timeList;
      this.timeText = timeText;
    },
    selectTime(v,index) {
      this.select[index][v.time] = v.value;
      this.renderTime();
      this.$emit('change', this.select)
      this.$nextTick(() => {   
        this.setScrollTop();
      })
    },
    setScrollTop(ev){   
      this.$refs.time.forEach(el => {
        let topVal = el.querySelector('p.selected').offsetTop;   
        el.querySelector('[scrollcontent]').scrollTop = topVal - 100;
      })
    }
  },
  computed: {
    showTimeText() {
      return function (objs) {
        return `${objs.hh} ：${objs.mm} ：${objs.ss}`
      }
    }
  },
  destroyed () {
    Scrollbar.unbindAll();
  }
}
</script>
