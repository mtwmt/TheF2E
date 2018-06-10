
var mandy = mandy || {};
mandy.model = mandy.model || {};
mandy.model.task = (function($){
  var
  getData = function( obj ){
    $.ajax({
      url: '../json/todolist.json',
      method: 'get',
      dataType: 'json',
      success: function( data ){
        console.log( data );
        obj.success( data );
      }
    });
  };
  return {
    getData: getData
  }

})(jQuery);



mandy.view = mandy.view || {};
mandy.view.task = (function($){
  var $layout = $('.content'),
      $task,
  
  tempTask = function( data ){
    var isTopic = (data.topic) ?'topic': '',
        isStar =  (data.topic) ?'fas': 'far';
    return [
      '<div class="m-task-item ', isTopic ,'">',
        '<div class="m-task-label">',
          '<div class="group">',
            '<div data="checkbox-check">',
              '<input type="checkbox" id="check', data.index ,'" />',
              '<label for="check', data.index ,'"></label>',
            '</div>',
          '</div>',
          '<div class="info">',
            '<h4>', data.title ,'</h4>',
            '<div class="state">',
              '<span class="data">',
                '<i class="far fa-calendar-alt fa-lg"></i>',
                '<em>', data.date ,'</em>',
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
              '<i class="', isStar ,' fa-star"></i>',
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
                '<input type="date">',
                '<input type="time">',
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
    ].join('');
  },
  init = function( data ){
    console.log('data1',data)
    var items = $('<div class="m-task-items">');
    items.append(function(){
      
      $task = data.todolist.map( function( e,i ){
        return $(tempTask( e ));
      });
      return $task;
    });

    $layout.append(
      items,
      '<p class="total">'+ data.total +' tasks left</p>'
    );
    
    return $task;
  };
  return{
    init: init
  }
    
})(jQuery);

mandy.controller = mandy.controller || {};
mandy.controller.task = (function($){
  var $layout = $('.content'),

  init = function(){
    mandy.model.task.getData({
      success: function( data ){
        mandy.view.task.init( data );
      }
    });
  };
  return{
    init: init
  }
})(jQuery);


mandy.controller.task.init();


// mandy.public = (function($){
//   var
//   d = new Date(),
//   $inputfile = $('[data=check-file]'),
//   init = function(){
//     console.log(123);
//     $inputfile.on('change','input',function(){
//       $(this).parent().find('.fileinfo').empty();
//       $(this).after(function(){
//         var d = new Date(),
//             date = d,
//             temp = [];
            
//         temp.push(
//           '<div class="fileinfo">',
//             '<p class="name">', $(this).val() ,'</p>',
//             '<p class="date">', date ,'</p>',
//           '</div>'
//         );
//         return temp.join('');
//       });
//       console.log( $(this).val() )
//     });
//   };
//   return{
//     init: init
//   }
// })(jQuery);



// mandy.public.init();
