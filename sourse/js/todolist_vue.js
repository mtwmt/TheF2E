Vue.config.devtools = true

var vm = new Vue({
  el: '#app',
  data: {
    target: 'My Tasks',
    navs: ['My Tasks', 'In Progress', 'Completed'],
    items: [],
  },
  computed: {
    getTask(){
      let temp = this.items.filter(e=>{
        if( this.target === 'Completed'){
          return e.complete
        }else if( this.target === 'In Progress' ){
          return (!e.complete)
        }else{
          return e;
        }
      });
      
      return temp;
    }
  },
  created: function() {
    const self = this
    axios.get('../json/todolist.json').then(function(res) {
      self.items = res.data.todolist
    })
  },
  methods: {
    changePage: function( obj ) {

      return this.target = obj;
    },
    orderedItems: function() {
      return this.items.sort((a, b) => {
        let scoreA = (a.topic ? -10000 : 0) + (a.complete ? 20000 : 0)
        let scoreB = (b.topic ? -10000 : 0) + (b.complete ? 20000 : 0)
        console.log(scoreA, scoreB)

        if (scoreA > scoreB) return 1
        else if (scoreA == scoreB) return 0
        else return -1
      });
    },
  },
})
