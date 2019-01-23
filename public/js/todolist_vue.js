'use strict';

Vue.config.devtools = true;

var vm = new Vue({
  el: '#app',
  data: {
    target: 'My Tasks',
    navs: ['My Tasks', 'In Progress', 'Completed'],
    items: []
  },
  computed: {
    getTask: function getTask() {
      var _this = this;

      var temp = this.items.filter(function (e) {
        if (_this.target === 'Completed') {
          return e.complete;
        } else if (_this.target === 'In Progress') {
          return !e.complete;
        } else {
          return e;
        }
      });

      return temp;
    }
  },
  created: function created() {
    var self = this;
    axios.get('../json/todolist.json').then(function (res) {
      self.items = res.data.todolist;
    });
  },
  methods: {
    changePage: function changePage(obj) {

      return this.target = obj;
    },
    orderedItems: function orderedItems() {
      return this.items.sort(function (a, b) {
        var scoreA = (a.topic ? -10000 : 0) + (a.complete ? 20000 : 0);
        var scoreB = (b.topic ? -10000 : 0) + (b.complete ? 20000 : 0);
        console.log(scoreA, scoreB);

        if (scoreA > scoreB) return 1;else if (scoreA == scoreB) return 0;else return -1;
      });
    }
  }
});