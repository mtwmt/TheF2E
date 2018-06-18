
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
  getData = function( callback,obj ){
    if( callback ){
      if( dataCache ){
        callback( dataCache );
      }else{
        $.ajax({
          url: 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',
          method: 'get',
          dataType: 'json',
          data:{
            // limit: obj.limit,
          },
          success: function( res ){
            dataCache = res.result || {};
            callback( dataCache );
          },
          error: function( err ){
            console.log( err );
          }
        });
      }
    }
    return dataCache;
  },
  // 過濾資料表
  getSearchData = function( callback ){
    var temp = [],
        aa;
    temp.location = [];
    temp.categories = [];
    getData( function( data ){
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
      searchData.categories.list = searchData.categories.list.map(function(e,l){
        // e = e.split(' ');
        console.log(e)
      });

      console.log( searchData.categories.list ,temp)
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
      $sidebar = $layout.find('.m-sidebar'),
      $main = $layout.find('.m-main'),
  tempSelect = function( data ){
    var temp = [];
    data.list.map(function( e,i ){
      // console.log(e);
      temp.push('<li>', e ,'</li>');
    });
    return [
      '<div class="m-filter">',
        '<div class="tit">Location</div>',
        '<div class="cont">',
          '<div class="group-select">',
            '<div class="group-select-hd">',
              '<span>Taiwan</span>',
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
    var temp = [
      '<div class="m-filter">',
        '<div class="tit">Categories</div>',
        '<div class="cont">',
          '<div class="group-checkbox">',
            '<div data="checkbox-check">',
              '<input type="checkbox" id="check1" />',
              '<label for="check1">All</label>',
            '</div>',
          '</div>',
          '<div class="group-checkbox">',
            '<div data="checkbox-check">',
              '<input type="checkbox" id="check2" />',
              '<label for="check2">Entertainment</label>',
            '</div>',
          '</div>',
          '<div class="group-checkbox">',
            '<div data="checkbox-check">',
              '<input type="checkbox" id="check3" />',
              '<label for="check3">Entertainment</label>',
            '</div>',
          '</div>',
        '</div>',
      '</div>'
    ];
    return temp.join('');
  },
  tempResults = function( data ){
    return[
      '<div class="m-results">',
        '<p>Showing <span>', data ,'</span> results by…</p>',
        '<div class="tags">',
          // '<div class="tag">Koahsiung<i class="far fa-times-circle"></i></div>',
          // '<div class="tag">aaa<i class="far fa-times-circle"></i></div>',
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
  tempList = function( data ){
    var temp = [];
    for( var i=0; i<5; i++ ){
      temp.push(tempCart( data[i] ));
    }
    return [
      '<div class="m-items">',
        temp.join(''),
      '</div>'
    ].join('');
  },
  pageList = function( data ){
    var $page = $('<page-list />'),
        $results = $(tempResults( data.total )),
        $categories = $results.find('.tags');

    $page.append(
      $results,
      tempList( data.records )
    ).appendTo( $main );
  },
  page = function( data ){
    var $select = $(tempSelect( data.location )),
        $categories = $(tempCategories( data.categories ));
        // $date = $(tempDate());

    // $select.on('click','.group-select-hd',function(){
    //   $(this).siblings('.group-select-bd').toggleClass('active');
    // });

    $sidebar.append(
      $select,
      $categories
    )
  };
  return{
    pageList: pageList,
    page: page
  }
})(jQuery);

mandy.controller = mandy.controller || {};
mandy.controller.filter = (function($){
  var
  total,
  init = function(){
    mandy.model.filter.getData(function( data ){
      console.log( 'getData',data )
      total = data.total;
      mandy.view.filter.pageList( data );
    },{ limit: 10 });

    mandy.model.filter.getSearchData(function( data ){
      mandy.view.filter.page( data );
      console.log( 'getSearchData',data )
    });
  }
  return{
    init: init
  }

})(jQuery);


mandy.controller.filter.init();