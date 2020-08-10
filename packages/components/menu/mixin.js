export default {
  data () {
    return {
      ParentLayerNum:0
    }
  },
  methods: {
    findParentComponents (val){
      let parent = val.$parent , opts = parent.$options
      if(parent && (opts.name == "jeSubMenu" || opts.name == "jeMenu")){
        this.ParentLayerNum = this.ParentLayerNum + 1
        this.findParentComponents(parent)
      }
      return this.ParentLayerNum  
    }
  }
};
