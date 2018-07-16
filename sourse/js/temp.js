
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
  getData = function( callback ){
    if( callback ){
      if( dataCache ){
        console.log( 1 )
        callback( dataCache );

        
      }else{
        $.ajax({
          url: 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',
          method: 'get',
          dataType: 'json',
          data:{
            limit: 300
          },
          success: function( res ){
            dataCache = res.result || {};
            console.log( 2 )
            callback( dataCache );
            
          },
          error: function( err ){
          }
        });
      }
    }
    return dataCache;
  },
  // 過濾資料表
  getSearchData = function( callback ){
    var temp = [];
    temp.location = [];
    temp.categories = [];

    
    getData( function( data ){
      console.log( 'qq' )  
      data.records.map(function( e,i ){
        temp.location.push(e.Zone);
        temp.categories.push(e.Ticketinfo);
      });
      for( var i in searchData ){
        if( searchData.hasOwnProperty(i) ){
          searchData[i].list = temp[i].filter(function( el,idx,arr ){
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

      callback( searchData );
    });
  };
  return {
    getSearchData: getSearchData,
    searchData: searchData,
    getData: getData
  }

})(jQuery);

mandy.view = mandy.view || {};
mandy.view.filter = (function($){
  var $layout = $('body > .content'),
      // $sidebar = $layout.find('.m-sidebar'),
      $main = $layout.find('.m-main'),
      plist = 10,
      
  tempSelect = function( data ){
    var temp = [];
    data.list.map(function( e,i ){
      temp.push('<li>', e ,'</li>');
    });
    return [
      '<div class="m-filter">',
        '<div class="tit">Location</div>',
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
  tempPage = function( data,num ){
    var currentPage = num || 1,
        pView = 5,
        totalPage = parseInt( data.length / plist );
        (totalPage == 0)? totalPage = totalPage: totalPage = totalPage + 1;

    var tempArr = [],
        start = (currentPage - ((currentPage - 1) % pView)),
        limit = Math.min(  (currentPage - ((currentPage - 1) % pView) + (pView - 1) ) ,totalPage);

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
  pageList = function( data ){
    var $page = $('<page-list />'),
        $results = $(tempResults( data.total ));
        // $categories = $results.find('.tags');

    $page.append(
      $results,
    ).appendTo( $main );
    $page.after( $('<page-article />') );
  },
  page = function( data ){
    return{
      select: $(tempSelect( data.location )),
      categories: $(tempCategories( data.categories ))
    }
  };
  return{
    tempList: tempList,
    tempCart: tempCart,
    tempPage: tempPage,
    tempArticle: tempArticle,
    pageList: pageList,
    page: page
  }
})(jQuery);

mandy.controller = mandy.controller || {};
mandy.controller.filter = (function($){
  var $layout = $('body > .content'),
      $sidebar = $layout.find('.m-sidebar'),
      $select,
      $categories,
      listArr = [],
      his = [],
      total,
  actSelect = function(){
    var $this = $(this),
        location = $this.text(),
        idx;

    listArr = [];
    $this.parents('.group-select-bd').removeClass('active');
    $select.find('.group-select-hd > span').text( $this.text() );
    // idx = locationArr.indexOf( location );
    // if( idx < 0  ){
    //   locationArr.push( location );
    //   $layout.find('.m-results .tags').append(
    //     '<div class="tag">'+ location +'<i class="far fa-times-circle"></i></div>'
    //   )
    // }

    // $layout.find('.m-items').empty();
    $layout.find('.m-results .tags').html(
      '<div class="tag">'+ location +'<i class="far fa-times-circle"></i></div>'
    );
    mandy.model.filter.getData(function( data ){
      var cnt;
      data.records.map(function( e,i ){
        if( location.indexOf( e.Zone ) >= 0 ){
          
          cnt = cnt || 0;
          cnt ++ ;
          // $layout.find('.m-items').append( $(mandy.view.filter.tempCart( e )) );
          // $layout.find('.m-items').replaceWith( $(mandy.view.filter.tempList( e )) );
          listArr.push(e);
          $layout.find('.m-results > p > span').text( cnt );
        }
      });
    });
    $layout.find('.m-items').replaceWith( $(mandy.view.filter.tempList( listArr )) );
    // $layout.find('.m-page').replaceWith( mandy.view.filter.tempPage( listArr ) );
    // $layout.find('.m-page').empty();
    // $('page-list').append(  mandy.view.filter.tempPage( listArr ));
  },
  pageChange = function( obj, url ){
    history.pushState( obj, '', url );
  },
  pageBack = function(){
    $('page-list').show();
    $('page-article').empty();

    // history.back();
    return false;
  },
  popState = function(){
    // pageBack();
  },
  pagination = function(){
    var $this = $(this);

    $this.parents('.m-page').find('a').removeClass('active');
    $layout.find('.m-items').replaceWith( mandy.view.filter.tempList( listArr, parseInt( $(this).data('page') ) - 1 ) );
    $layout.find('.m-page').replaceWith( mandy.view.filter.tempPage( listArr, $(this).data('page') ) );

    return false;
  },
  init = function(){
    mandy.model.filter.getData(function( data ){
      total = data.total;
      listArr = data.records;
      mandy.view.filter.pageList( data );
      $('page-list').append( 
        mandy.view.filter.tempList( listArr ),
        mandy.view.filter.tempPage( listArr )
      );
      
      $layout
        .on('click','.m-items > .m-cart', function(){
          var $this = $(this),
              id = $this.data('id');
            data.records.map(function( e,i ){
              if( e.Id.indexOf( id ) >=0 ) {
                
                // his.push({
                //   obj: e
                // });
                $('page-list').hide();
                $('page-article').append( mandy.view.filter.tempArticle( e ) );
                // pageChange( e, '?id='+ id +'' );
              }
            });
          return false;
        })
        .on('click','.m-page a', pagination);
    });

    mandy.model.filter.getSearchData(function( data ){
        $select = mandy.view.filter.page( data ).select;
        $categories = mandy.view.filter.page( data ).categories;
      $select
          .on('click','.group-select-hd',function(){
            $(this).siblings('.group-select-bd').toggleClass('active');
          })
          .on('click','.group-select-bd > ul > li', actSelect );
      $sidebar.append(
        $select,
        $categories
      );
    });

    $layout.on('click','[data-back]',pageBack);
      
    // $(window).on('popstate', popState).trigger('popstate');
  }
  return{
    init: init
  }

})(jQuery);


mandy.controller.filter.init();