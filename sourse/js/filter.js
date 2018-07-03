var mandy = mandy || {};
mandy.model = mandy.model || {};
mandy.model.filter = (function($){
  var
  dataCache,
  searchData  = {
    location:{
      tit: 'Location'
    },
    categories:{
      tit: 'Categories'
    }
  },
  getData = function( callback, obj ){
    var set = obj || {};
    $.ajax({
      url: 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',
      method: 'get',
      dataType: 'json',
      data:{
        limit: set.limit || 300,
        q: set.q || ''
      },
      success: function( res ){
        dataCache = res.result || {};
        callback({
          data: dataCache.records,
          total: dataCache.total
        })
      },
      error: function( err ){
      }
    });
    return dataCache;
  },
  getloatData = function( callback ){
    if( dataCache ){
      console.log('noload');
      callback( dataCache );
    }else{
      getData(function( data ){
        data.location = [];
        data.categories = [];
        data.data.map(function( e,i ){
          data.location.push(e.Zone);
          data.categories.push(e.Ticketinfo);
        });
        // 處理資料表
        for( var i in searchData ){
          if( searchData.hasOwnProperty(i) ){
            searchData[i].list = data[i].filter(function( el,idx,arr ){
              return arr.indexOf(el) === idx;
            });
          }
        }
        searchData.categories.list = searchData.categories.list.filter(function( el,idx,arr ){
          if( el.length > 0 ){
            return el;
          }
        });
        searchData.categories.list.map( function(e,i){
          e = e.split(' ');
          return searchData.categories.list[i] = e[0];
        });
        callback( data );
      });
    }
  };
  return{
    getData: getData,
    searchData: searchData,
    getloatData: getloatData
  }
})(jQuery);

mandy.view = mandy.view || {};
mandy.view.filter = (function($){
  var $layout = $('body > .content'),
      plist = 3,
  tempSelect = function( data ){
    var temp = [];
    data.list.map(function( e,i ){
      temp.push('<li>', e ,'</li>');
    });
    return [
      '<div class="m-filter">',
        '<div class="tit">', data.tit ,'</div>',
        '<div class="cont">',
          '<div class="group-select">',
            '<div class="group-select-hd">',
              '<span>地區</span>',
            '</div>',
            '<div class="group-select-bd">',
              '<ul>',
                temp.join(''),
              '</ul>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ].join('');
  },
  tempCategories  = function( data ){
    var temp = [];
    data.list.map(function( e,i ){
      temp.push(
        '<div class="group-checkbox">',
          '<div data="checkbox-check">',
            '<input type="checkbox" id="check',i,'" />',
            '<label for="check',i,'">', e ,'</label>',
          '</div>',
        '</div>'
      );
    });
    return [
      '<div class="m-filter">',
        '<div class="tit">', data.tit ,'</div>',
        '<div class="cont">', 
          temp.join(''),
        '</div>',
      '</div>'
    ].join('');
  },
  tempResults = function( data ){
    return[
      '<div class="m-results">',
        '<p>Showing <span>', data ,'</span> results by…</p>',
        '<div class="tags">',
        '</div>',
      '</div>'
    ].join('');
  },
  tempCart = function( data ){
    return [
      '<a href="#" class="m-cart" data-id=', data.Id ,'>',
        '<figure><img src="', data.Picture1 ,'" alt=""></figure>',
        '<div class="m-cart-cont">',
          '<h4>', data.Name ,'</h4>',
          '<div class="description">', data.Description ,'</div>',
          '<div class="organizer">',
            '<em>說明</em>',
            '<div class="tags">',
              '<div class="tag">', data.Ticketinfo ,'</div>',
            '</div>',
          '</div>',
          '<div class="info">',
            '<span>',
              '<i class="fa fa-map-marker-alt"></i>',
              '<em>', data.Zone ,'</em>',
            '</span>',
            '<span>',
                '<i class="far fa-calendar-alt"></i>',
                '<em>', data.Opentime ,'</em>',
            '</span>',
          '</div>',
        '</div>',
      '</a>'
    ].join('');
  },
  tempList = function( data, num ){
    num = num || 0;
    var temp = [],
        start = num * plist,
        limit = Math.min( (start + plist), data.length);
    for( start; start < limit; start ++){
      temp.push( tempCart( data[start] ));
    }
    return [
      '<div class="m-items">',
        temp.join(''),
      '</div>'
    ].join('');
  },
  // 分頁
  tempPage = function( data,num ){
    console.log( 'pg',data );
    var currentPage = num || 1,
        pLimit = 5,
        totalPage = parseInt( data / plist );  //總頁數
        (totalPage % plist == 0)? totalPage = totalPage: totalPage = totalPage + 1;
    var tempArr = [],
        start = (currentPage - ((currentPage - 1) % pLimit)),
        limit = Math.min(  (currentPage - ((currentPage - 1) % pLimit) + (pLimit - 1) ) ,totalPage);

    for( start; start <= limit ; start++ ){
      var active = (currentPage === start)? 'active':'';
      tempArr.push(
        '<li><a data-page="', start ,'" class="', active ,'" href="#">', start ,'</a></li>'
      );
    };
    return [
      '<div class="m-page">',
      (currentPage <= 1)? '' : '<span><a href="#" data-page="'+ (currentPage - 1) +'"  class="prev"><i class="fas fa-angle-double-left"></i></a></span>',
        '<ul>',
          tempArr.join(''),
        '</ul>',
      (currentPage >= totalPage)? '' : '<span><a href="#" data-page="'+ (currentPage + 1) +'" class="next"><i class="fas fa-angle-double-right"></i></a></span>',
      '</div>'
    ].join('');
  },
  tempArticle = function( data ){
    return [
      '<div class="m-breadcrumbs">',
        '<ul>',
          '<li>', data.Zone ,'</li>',
          '<li>', data.Name ,'</li>',
        '</ul>',
        '<a href="#" data-back>回上頁</a>',
      '</div>',
      '<div class="m-article">',
        '<figure><img src="', data.Picture1 ,'" alt=""></figure>',
        '<div class="m-article-cont">',
          '<h2>', data.Name ,'</h2>',
          '<div class="organizer">',
            '<em>說明</em>',
            '<div class="tags">',
              '<div class="tag">', data.Ticketinfo ,'</div>',
            '</div>',
          '</div>',
          '<div class="info">',
            '<span>',
              '<i class="fa fa-map-marker-alt"></i>',
              '<em>', data.Add ,'</em>',
            '</span>',
            '<span>',
                '<i class="far fa-calendar-alt"></i>',
                '<em>', data.Opentime ,'</em>',
            '</span>',
          '</div>',
          '<div class="description">', data.Description ,'</div>',
        '</div>',
      '</div>'
    ].join('');
  },
  pageSide = function( data ){
    return{
      select: $(tempSelect( data.location )),
      categories: $(tempCategories( data.categories ))
    }
  };
  return{
    tempResults: tempResults,
    tempList: tempList,
    tempPage: tempPage,
    tempArticle: tempArticle,
    pageSide: pageSide
  }
})(jQuery);

mandy.controller = mandy.controller || {};
mandy.controller.filter = (function($){
  var $layout = $('body > .content'),
      $sidebar = $layout.find('.m-sidebar'),
      $main = $layout.find('.m-main'),
      $pageList = $('<page-list />').appendTo( $main ),
      $pageArticle = $('<page-article />').appendTo( $main ),
      data,
      $select,
      $categories,
      listArr,
  showPage = function( item ){
    $main.find('.m-results > p > span').text( item.length );
    $main.find('.m-items').replaceWith( mandy.view.filter.tempList( item ) );
    $main.find('.m-page').replaceWith( mandy.view.filter.tempPage( item.length ) );
  },
  pageBack = function(){
    $pageList.show();
    $pageArticle.empty();

    // history.back();
    return false;
  },
  pageChange = function(){
    var $this = $(this),
        id = $this.data('id');

    listArr.map(function( e,i ){
      if( e.Id.indexOf( id ) >=0 ) {
        $pageList.hide();
        $pageArticle.append( mandy.view.filter.tempArticle( e ) );
      }
    });
    return false;
  },
  actSelect = function(){
    var $this = $(this),  
        location = $this.text(),    
        cnt;
    listArr = [];
    $this.parents('.group-select-bd').removeClass('active');
    $select.find('.group-select-hd > span').text( $this.text() );
    $main.find('.m-results .tags').html(
      '<div class="tag">'+ location +'<i class="far fa-times-circle"></i></div>'
    );
    data.map(function( e,i ){
      if( location.indexOf( e.Zone ) >= 0 ){
        cnt = cnt || 0;
        cnt ++ ;
        listArr.push(e);
      }
    });
    showPage( listArr );
  },
  pagination = function(){

    $main.find('.m-items').replaceWith( mandy.view.filter.tempList( listArr, parseInt( $(this).data('page') ) - 1 ) );
    $main.find('.m-page').replaceWith( mandy.view.filter.tempPage( listArr.length , $(this).data('page') ) );
    
    return false;
  },
  init = function(){
    var searchData = mandy.model.filter.searchData;

    mandy.model.filter.getloatData(function( res ){
      data = res.data;
      listArr = data;
      $select = mandy.view.filter.pageSide( searchData ).select
        .on('click','.group-select-hd',function(){
          $(this).siblings('.group-select-bd').toggleClass('active');
        })
        .on('click','.group-select-bd > ul > li', actSelect );
      $categories = mandy.view.filter.pageSide( searchData ).categories;
      $sidebar.append(
        $select,
        $categories
      );
      $pageList.append( 
        mandy.view.filter.tempResults( listArr.length ),
        mandy.view.filter.tempList( listArr ),
        mandy.view.filter.tempPage( listArr.length )
      );
    });

    $main
      .on('click','.m-items > .m-cart', pageChange)
      .on('click','.m-page a', pagination)
      .on('click','.m-results .tag',function(){
        $(this).remove();
        $select.find('.group-select-hd > span').text( '地區' );
        listArr = data;
        showPage( listArr );
      });
      

    $layout.on('click','[data-back]',pageBack);
  }
  return{
    pagination: pagination,
    init: init
  }

})(jQuery);

mandy.controller.filter.init();