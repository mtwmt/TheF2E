var mandy = mandy || {};
mandy.model = mandy.model || {};

mandy.model.comicviewer = (function($){
  var
  getData = function( callback,obj ){
    $.ajax({
      url: '../json/comicviewer.json',
      method: 'get',
      dataType: 'json',
      data: {},
      success: function( data ){
        data = data || {};
        callback( data );
      }
    });
  };
  return {
    getData: getData
  }

})(jQuery);

mandy.view = mandy.view || {};
mandy.view.comicviewer = (function($){
  var 
  tempEvent = function( data, chapter ){
    var tempChapter = [],
        tempPage = [];
        
    data.map(function( e, i ){
      var chapter = e.chapter.split(':');
      e.chapter = chapter[0];
      tempChapter.push(
        '<option value="', e.chapter ,'">', e.chapter ,'</option>'
      );
    });
    data[chapter].list.map(function( e,i ){
      tempPage.push(
        '<option value="page',i,'">page ',i + 1,'</option>'
      );
    });
    return [
      '<div class="m-event">',
        '<div class="m-select">',
          '<label for="">My Hexschool</label>',
          '<select name="chapter" id="chapter">',
            tempChapter.join(''),
            // '<option value="Chapter1">Chapter 1</option>',
            // '<option value="Chapter2">Chapter 2</option>',
          '</select>',
          '<select name="page" id="page">',
            tempPage.join(''),
            // '<option value="page1">page 1</option>',
            // '<option value="page2">page 2</option>',
          '</select>',
        '</div>',
        '<div class="m-switch">',
          '<i class="fas fa-sun"></i>',
          '<i class="far fa-moon"></i>',
          '<input type="checkbox" id="switch" />',
          '<label for="switch"></label>',
        '</div>',
    '</div>'
    ].join('');
  },
  tempPage = function( data ){
    return [
      '<div class="m-page">',
        '<div class="btn-prev"></div>',
        '<div class="btn-next"></div>',
        '<div class="pic">',
          '<figure><img src="images/comicviewer/storyboard-1.png" alt=""></figure>',
        '</div>',
      '</div>'
    ].join('');
  },
  tempItem = function( data, chapter){
    var temp = [];
    data[chapter].list.map(function( e,i ){
      temp.push(
        '<li><img src="', e.url ,'" width="', e.width ,'" height="', e.height ,'" alt=""></li>'
      );
    });
    return [
      '<div class="m-slide">',
        '<div class="items">',
          '<div class="btn-prev"></div>',
          '<div class="btn-next"></div>',
          '<ul></ul>',
        '</div>',
      '</div>'
    ].join('');
  },
  init = function( data, chapter ){
    var $pageInner = $('page-inner > .content');

    $pageInner.append(
      tempEvent( data.comic, chapter),
      tempPage( data ),
      tempItem( data.comic, chapter)
    );
    
    return $pageInner;
  };
  return{
    init: init
  }
    
})(jQuery);

mandy.controller = mandy.controller || {};
mandy.controller.comicviewer = (function(){
  var $layout = $('page-inner > .content'),
      $page,
      $slide,
      $items,
      $item,
      $item_len,
      picidx,
  imgLoad = function( url, idx ){
    var img = new Image();
    img.onload = function(){
      slideEvent( img, idx );
    };
    img.src = url;
  },
  slideEvent = function( img,idx ){
    var $item = $('<li />').append(img).attr('data-num',idx);

    $items.append( $item );
    $slide.height( $item.outerHeight() + 40 );
    $item.width( parseInt( $slide.outerWidth() / 6 ,10) );

    var $item_w = $item.width(),
        $item_btn_prev = $slide.find('.btn-prev'),
        $item_btn_next = $slide.find('.btn-next'),
        pos;

      $item.css({ left: idx * $item_w });
      
      if( idx > 2 && idx < $item_len - 3 ){
        pos = (idx - 2) * $item_w;
      }else if( idx >= ($item_len - 3) ){
        pos = ($item_len - 3) * $item_w;
      }else{
        pos = 0;
      }
      $item.attr('data-pos', pos );  
      $items.css({ left: $item_w / 2 });
      $items.width( $item_len * $item_w + $item_w / 2 );
      $item_btn_prev.width( $item.find('img').outerWidth() / 2 ).height( $item.find('img').height() );
      $item_btn_next.width( $item.find('img').outerWidth() / 2 ).height( $item.find('img').height() );
    
      $items.find('[data-num='+ picidx +']').trigger('click');
  },
  slide = function(){
    picidx = $items.find('.active').data('num') || 0;
    $items.on('click','li',function(){
      var $this = $(this);
      $items.find('li').removeClass('active');
      $this.addClass('active');
      $slide.stop().animate({ scrollLeft: $this.data('pos') }, 400);
      $page.find('img').attr('src', $this.find('img').attr('src') );
    });

    $('.btn-prev').on('click',function(){
      if( picidx === 0 ){
        picidx = 0;
      }else{
        picidx = picidx - 1;
      }
      $items.find('[data-num='+ picidx +']').trigger('click');
    });

    $('.btn-next').on('click',function(){
      if( picidx === $item_len - 1){
        picidx = picidx;
      }else{
        picidx = picidx + 1;
      }
      $items.find('[data-num='+ picidx +']').trigger('click');
    });

  },
  creatPage = function( data ){
    
    mandy.view.comicviewer.init( data,0 );
    $page = $layout.find('.m-page');
    $slide = $layout.find('.m-slide .items');
    $items = $slide.find('ul');
    $item_len = data.comic[0].list.length;

    data.comic[0].list.map(function( e,i ){
      imgLoad(e.url, i)
    });

    
    slide(); 

  },
  init = function(){

    mandy.model.comicviewer.getData(function( data ){
      console.log( data )
      creatPage( data )
    });
  };
  return{
    init:init
  }

})(jQuery);

$( document ).ready(function(){
  mandy.controller.comicviewer.init();
});


