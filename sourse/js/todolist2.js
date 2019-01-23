Vue.config.devtools = true;

Vue.component('nav-bar',{
  props: ['nav','active'],
  template: [
    '<nav>',
      '<ul>',
        // '<li v-for="item in nav"  :class="{ \'is-active\':item.on }" ><a href="#">{{ item.title }}</a></li>',
        '<li v-for="(item, idx) in nav" @click="on(item.title,active)" v-model="active" :class="{ \'is-active\':item.title === active }" ><a href="#">{{ item.title }}</a></li>',
      '</ul>',
    '</nav>',
  ].join(''),
  methods:{
    on: function( tit,act ){
      act = tit;
      console.log( tit,act )
    }
  }
});

Vue.component('task-item',{
  props:['item','idx'],
  template: [
    '<div class="m-task-item" :class="{ topic:item.topic, \'is-edit\':item.edit, \'is-del\':item.complete }">',
      '<div class="m-task-label">',
        '<div class="group">',
          '<div data="checkbox-check">',
            '<input type="checkbox" :id="\'check\' + idx" v-model="item.complete" />',
            '<label :for="\'check\' + idx"></label>',
          '</div>',
        '</div>',
        '<div class="info">',
          '<input type="text" v-model="item.title">',
          '<div class="state">',
            '<span class="data">',
              '<i class="far fa-calendar-alt fa-lg"></i>',
              '<em>{{ item.date }}</em>',
            '</span>',
            '<span class="file">',
              '<i class="far fa-file fa-lg"></i>',
            '</span>',
            '<span class="remark">',
              '<i class="far fa-comment-dots fa-lg"></i>',
            '</span>',
          '</div>',
        '</div>',
        '<div class="edit">',
            '<i class="fa-star" @click="item.topic=!item.topic" :class="item.topic?\'fas\':\'far\'" ></i>',
            '<i class="far fa-edit" @click="item.edit=!item.edit"></i>',
        '</div>',
      '</div>',
      '<div class="m-task-event">',
        '<div class="m-task-block">',
          '<div class="deadline">',
            '<div class="tit">',
              '<i class="far fa-calendar-alt"></i>',
              '<span>Deadline</span>',
            '</div>',
            '<div class="cont">',
              '<input type="date" v-model="item.date">',
              // '<input type="time">',
            '</div>',
          '</div>',
          '<div class="file">',
            '<div class="tit">',
              '<i class="far fa-file"></i>',
              '<span>File</span>',
            '</div>',
            '<div class="cont">',
              '<div data="check-file">',
                '<input type="file" id="file">',
                '<label for="file"></label>',
              '</div>',
            '</div>',
          '</div>',
          '<div class="comment">',
            '<div class="tit">',
              '<i class="far fa-comment-dots"></i>',
              '<span>Comment</span>',
            '</div>',
            '<div class="cont">',
              '<textarea name="" id="" cols="30">Type your memo here...</textarea>',
            '</div>',
          '</div>',
        '</div>',
        '<div class="btns">',
          '<a href="javascript:;" class="cancel">',
            '<i class="fa fa-times"></i>',
            'Cancel',
          '</a>',
          '<a href="javascript:;" class="save">',
            '<i class="fa fa-plus"></i>',
            'Save',
          '</a>',
        '</div>',
      '</div>',
    '</div>'
  ].join('')
});

Vue.component('add-task',{
  props: ['add'],
  template:[
    // :class="{\'is-active\':add.open}"
    '<div class="m-addtask is-active" >',
      '<div class="add" @click="add.open=true">+ Add Task</div>',
      '<div class="addinner">',
        '<div class="m-task-item topic is-edit">',
            '<div class="m-task-label">',
              '<div class="group">',
                '<div data="checkbox-check">',
                  '<input type="checkbox" id="check" />',
                  '<label for="check"></label>',
                '</div>',
              '</div>',
              '<div class="info">',
                '<input type="text" placeholder="Type Something Here…" v-model="cache.title" />',
                '<div class="state">',
                  '<span class="data">',
                    '<i class="far fa-calendar-alt fa-lg"></i>',
                    '<em>5/14</em>',
                  '</span>',
                  '<span class="file">',
                    '<i class="far fa-file fa-lg"></i>',
                  '</span>',
                  '<span class="remark">',
                    '<i class="far fa-comment-dots fa-lg"></i>',
                  '</span>',
                '</div>',
              '</div>',
              '<div class="edit">',
                  '<i class="fas fa-star"></i>',
                  '<i class="far fa-edit"></i>',
              '</div>',
            '</div>',
            '<div class="m-task-event">',
              '<div class="m-task-block">',
                '<div class="deadline">',
                  '<div class="tit">',
                    '<i class="far fa-calendar-alt"></i>',
                    '<span>Deadline</span>',
                  '</div>',
                  '<div class="cont">',
                    '<input type="date" v-model="cache.date">',
                    // '<input type="time">',
                  '</div>',
                '</div>',
                '<div class="file">',
                  '<div class="tit">',
                    '<i class="far fa-file"></i>',
                    '<span>File</span>',
                  '</div>',
                  '<div class="cont">',
                    '<div data="check-file">',
                      '<input type="file" id="file">',
                      '<label for="file"></label>',
                    '</div>',
                  '</div>',
                '</div>',
                '<div class="comment">',
                  '<div class="tit">',
                    '<i class="far fa-comment-dots"></i>',
                    '<span>Comment</span>',
                  '</div>',
                  '<div class="cont">',
                    '<textarea name="" id="" cols="30" v-model="cache.comment">{{ add.comment }}</textarea>',
                  '</div>',
                '</div>',
              '</div>',
              '<div class="btns">',
                '<a href="javascript:;" class="cancel" @click="add.open=false">',
                  '<i class="fa fa-times"></i>',
                  'Cancel',
                '</a>',
                '<a href="javascript:;" class="save" @click="update">',
                  '<i class="fa fa-plus"></i>',
                  'Save',
                '</a>',
              '</div>',
            '</div>',
          '</div>',
      '</div>',
    '</div>'
  ].join(''),
  data(){
    return{
      cache:{
        comment: '11Type your memo here...',
        topic: false,
        edit: false
      }
    }
  },
  methods: {
    update: function(){
      vm.todolist.push( this.cache );
      console.log( this.cache, vm.todolist )
    }
  }
});


var vm = new Vue({
  el: '#app',
  data: {
    "act": 'In Progress',
    "nav": [
      {
        title: 'My Tasks'
      },
      {
        title: 'In Progress'
      },
      {
        title: 'Completed'
      }
    ],
    "addtask":{
      "open": false
    },
    "todolist": [
      {
        "title": "aaa",
        "date": "",
        "topic": false,
        "edit": false,
        "complete": false,
        "file": "aaa.txt",
        "comment": "這是留言備註這是留言備註這是留言備註這是留言備註"
      },
      {
        "title": "bbb",
        "date": "",
        "topic": false,
        "edit": false,
        "complete": false,
        "file": "aaa.txt",
        "comment": "這是留言備註這是留言備註這是留言備註這是留言備註"
      },
      {
        "title": "ccc",
        "date": "",
        "topic": false,
        "edit": false,
        "complete": false,
        "file": "aaa.txt",
        "comment": "這是留言備註這是留言備註這是留言備註這是留言備註"
      },
      {
        "title": "QQ",
        "date": "",
        "topic": false,
        "edit": false,
        "complete": false,
        "file": "aaa.txt",
        "comment": "這是留言備註這是留言備註這是留言備註這是留言備註"
      }
    ]
  }
});