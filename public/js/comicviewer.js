'use strict';

var mandy = mandy || {};
mandy.model = mandy.model || {};
mandy.model.comicviewer = function ($) {
  var imgLoad = function imgLoad(url, callback) {
    var img = new Image();
    img.src = url;
    if (img.complete) {
      // 如果圖片已經存在於瀏覽器緩存，直接調用回調函數 
      callback.call(img);
      return; // 直接返回，不用再處理onload事件 
    }
    img.onload = function () {
      //圖片下載完畢時非同步調用callback函數。 
      callback.call(img); //將回調函數的this替換為Image對象 
    };
  },
      getData = function getData(obj, callback) {
    var set = obj.data;
    set.chapter = obj.data.chapter || 0;
    set.pg = obj.data.pg || 0;
    $.ajax({
      url: '../json/comicviewer.json',
      method: 'get',
      dataType: 'json',
      data: set,
      success: function success(data) {
        // data = data || {};

        // data.comic.map(function( e,i ){
        //   e.list.map(function( el,idx ){
        //     imgLoad( el.url, function(){
        //       var temp = [];
        //       temp.width = el.width = this.width;
        //       temp.height = el.height = this.height;
        //       return temp;
        //     });


        //   });
        //   console.log( data.comic[0].list[0].url )
        // });


        obj.success(data);
        // mandy.controller.comicviewer.slide();
      }
    });
  };
  return {
    imgLoad: imgLoad,
    getData: getData
  };
}(jQuery);

mandy.view = mandy.view || {};
mandy.view.comicviewer = function ($) {
  var tempEvent = function tempEvent(data, chapter) {
    var tempChapter = [],
        tempPage = [];

    data.map(function (e, i) {
      var chapter = e.chapter.split(':');
      e.chapter = chapter[0];
      tempChapter.push('<option value="', e.chapter, '">', e.chapter, '</option>');
    });
    data[chapter].list.map(function (e, i) {
      tempPage.push('<option value="page', i, '">page ', i + 1, '</option>');
    });
    return ['<div class="m-event">', '<div class="m-select">', '<label for="">My Hexschool</label>', '<select name="chapter" id="chapter">', tempChapter.join(''),
    // '<option value="Chapter1">Chapter 1</option>',
    // '<option value="Chapter2">Chapter 2</option>',
    '</select>', '<select name="page" id="page">', tempPage.join(''),
    // '<option value="page1">page 1</option>',
    // '<option value="page2">page 2</option>',
    '</select>', '</div>', '<div class="m-switch">', '<i class="fas fa-sun"></i>', '<i class="far fa-moon"></i>', '<input type="checkbox" id="switch" />', '<label for="switch"></label>', '</div>', '</div>'].join('');
  },
      tempPage = function tempPage(data) {
    return ['<div class="m-page">', '<div class="btn-prev"></div>', '<div class="btn-next"></div>', '<div class="pic">', '<figure><img src="images/comicviewer/storyboard-1.png" alt=""></figure>', '</div>', '</div>'].join('');
  },
      tempItem = function tempItem(data, chapter) {
    // var temp = [];

    // data[chapter].list.map(function( e,i ){
    //   temp.push(
    //     '<li><img src="', e.url ,'" width="', e.width ,'" height="', e.height ,'" alt=""></li>'
    //   );

    //   console.log( e.url )
    // });

    return ['<div class="m-slide">', '<div class="items">', '<div class="btn-prev"></div>', '<div class="btn-next"></div>', '<ul>',
    // temp.join(''),
    // '<li class="active"><img src="images/comicviewer/storyboard-1.png" alt=""></li>',
    // '<li><img src="images/comicviewer/storyboard-2.png" alt=""></li>',
    // '<li><img src="images/comicviewer/storyboard-3.png" alt=""></li>',
    // '<li><img src="images/comicviewer/storyboard-4.png" alt=""></li>',
    // '<li><img src="images/comicviewer/storyboard-5.png" alt=""></li>',
    // '<li><img src="images/comicviewer/storyboard-6.png" alt=""></li>',
    // '<li><img src="images/comicviewer/storyboard-7.png" alt=""></li>',
    // '<li><img src="images/comicviewer/storyboard-8.png" alt=""></li>',
    // '<li><img src="images/comicviewer/storyboard-9.png" alt=""></li>',
    // '<li><img src="images/comicviewer/storyboard-10.png" alt=""></li>',
    // '<li><img src="images/comicviewer/storyboard-11.png" alt=""></li>',
    // '<li><img src="images/comicviewer/storyboard-12.png" alt=""></li>',
    '</ul>', '</div>', '</div>'].join('');
  },
      init = function init(data, chapter) {
    var $pageInner = $('page-inner > .content');

    $pageInner.append(tempEvent(data.comic, chapter), tempPage(data), tempItem(data.comic, chapter));

    return $pageInner;
  };
  return {
    init: init
  };
}(jQuery);

mandy.controller = mandy.controller || {};
mandy.controller.comicviewer = function ($) {
  var $layout = $('page-inner > .content'),
      $page,
      $slide,
      $items,
      $item,
      $item_len,
      picidx,
      $image,
      picTemp = function picTemp(data) {
    console.log('picTemp', data);
    var temp = [];

    data.map(function (e, i) {
      temp.push('<li><img src="', e.url, '"></li>');
    });

    $item = $(temp.join(''));
    $image = $item.find('>img');

    return $item;
  },
      creatPage = function creatPage(data) {

    var pic;
    mandy.view.comicviewer.init(data, 0);

    $page = $layout.find('.m-page');
    $slide = $layout.find('.m-slide .items');

    // console.log( data.comic[0].list );
    slide(data.comic[0].list);
    // $items = $slide.find('ul').append( picTemp( data.comic[0].list ) );
  },
      slide = function slide(data) {

    var img = new Image();
    img.src = 'images/comicviewer/storyboard-7.png';
    img.onload = function () {
      console.log(img.width, img.height);
    };

    // data.map(function( e,i ){
    //   console.log(  'slide1', e.url )
    //   img.src = e.url
    // });
    // var img = new Image();
    // img.src = 
    // img.onload = function(){
    //   // console.log( img.width )
    // }
    // url = $image.eq(0).attr('src');

  },

  // imgChange = function( idx ){
  //   $item.removeClass('active');
  //   $item.eq(idx).addClass('active');
  //   $slide.stop().animate({ scrollLeft: $item.eq(idx).data('pos') }, 400);
  //   $page.find('img').attr('src', $item.eq(idx).find('img').attr('src') );
  // },

  // slide = function(){
  //   $page = $layout.find('.m-page');
  //   $slide = $layout.find('.m-slide .items');
  //   $items = $slide.find('ul');

  //   $item = $slide.find('li');
  //   $item_len = $item.length;

  //   $item.width( parseInt( $slide.outerWidth() / 6 ,10) );
  //   $slide.height( $item.outerHeight() + 40 );
  //   // $slide.height( $item.find('img').height()  )

  //   var $item_w = $item.width(),
  //       $item_btn_prev = $slide.find('.btn-prev'),
  //       $item_btn_next = $slide.find('.btn-next');


  //   // 計算圖片位子 分別給值
  //   $item.each(function( i,e ){
  //     var pos;
  //     $(e).css({ left: i * $item_w }).attr('data-num', i);
  //     if( i > 2 && i < $item_len - 3 ){
  //       pos = (i-2) * $item_w;
  //     }else if( i >= ($item_len - 3) ){
  //       pos = ($item_len - 3) * $item_w;
  //     }else{
  //       pos = 0;
  //     }
  //     $(e).attr('data-pos', pos );
  //   });
  //   $item_btn_prev.width( $item.find('img').outerWidth() / 2 ).height( $item.find('img').height() );
  //   $item_btn_next.width( $item.find('img').outerWidth() / 2 ).height( $item.find('img').height() );

  //   $items.css({ left: $item_w / 2 });
  //   $items.width( $item_len * $item_w + $item_w / 2 );
  //   picidx = $items.find('.active').data('num');


  //   // console.log( $item.find('img').parents('.items').find('li').width() )

  //   $item.on('click',function(){
  //     picidx = $(this).data('num');
  //     imgChange( picidx );
  //   });
  //   $item_btn_prev.on('click',function(){
  //     if( picidx === 0 ){
  //       picidx = 0;
  //     }else{
  //       picidx = picidx - 1;
  //     }
  //     imgChange( picidx );
  //   });
  //   $item_btn_next.on('click',function(){
  //     if( picidx === $item_len - 1){
  //       picidx = picidx;
  //     }else{
  //       picidx = picidx + 1;
  //     }
  //     imgChange( picidx );
  //   });

  // },

  init = function init() {

    mandy.model.comicviewer.getData({
      data: {
        chapter: 0,
        pg: 0
      },
      success: creatPage
    });
  };
  return {
    init: init
    // slide: slide
  };
}(jQuery);

$(document).ready(function () {
  mandy.controller.comicviewer.init();
});