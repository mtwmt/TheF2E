'use strict';

var mandy = mandy || {};
mandy.model = mandy.model || {};
mandy.model.filter = function ($) {
  var dataCache,
      searchData = {
    location: {
      tit: 'Location'
    },
    categories: {
      tit: 'Categories'
    }
  },
      getData = function getData(callback, obj) {
    var set = obj || {};
    $.ajax({
      url: 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',
      method: 'get',
      dataType: 'json',
      data: {
        limit: set.limit || 300,
        q: set.q || ''
      },
      success: function success(res) {
        dataCache = res.result || {};
        // callback( dataCache ); 
        callback({
          data: dataCache.records,
          total: dataCache.total
        });
      },
      error: function error(err) {}
    });
    return dataCache;
  },
      getloatData = function getloatData(callback) {
    if (dataCache) {
      console.log('noload');
      callback(dataCache);
    } else {
      console.log('load');
      getData(function (data) {
        callback(data);
      });
    }
  };
  return {
    getData: getData,
    getloatData: getloatData
  };
}(jQuery);

mandy.view = mandy.view || {};
mandy.view.filter = function ($) {
  var $layout = $('body > .content'),
      plist = 10,
      tempResults = function tempResults(data) {
    return ['<div class="m-results">', '<p>Showing <span>', data, '</span> results by…</p>', '<div class="tags">', '</div>', '</div>'].join('');
  },
      tempCart = function tempCart(data) {
    return ['<a href="#" class="m-cart" data-id=', data.Id, '>', '<figure><img src="', data.Picture1, '" alt=""></figure>', '<div class="m-cart-cont">', '<h4>', data.Name, '</h4>', '<div class="description">', data.Description, '</div>', '<div class="organizer">', '<em>說明</em>', '<div class="tags">', '<div class="tag">', data.Ticketinfo, '</div>', '</div>', '</div>', '<div class="info">', '<span>', '<i class="fa fa-map-marker-alt"></i>', '<em>', data.Zone, '</em>', '</span>', '<span>', '<i class="far fa-calendar-alt"></i>', '<em>', data.Opentime, '</em>', '</span>', '</div>', '</div>', '</a>'].join('');
  },
      tempList = function tempList(data, num) {
    num = num || 0;
    var temp = [],
        start = num * plist,
        limit = Math.min(start + plist, data.length);
    for (start; start < limit; start++) {
      temp.push(tempCart(data[start]));
    }
    return ['<div class="m-items">', temp.join(''), '</div>'].join('');
  },
      tempPage = function tempPage(data, num) {
    var currentPage = num || 1,
        pLimit = 5,
        totalPage = parseInt(data / plist); //總頁數
    totalPage == 0 ? totalPage = totalPage : totalPage = totalPage + 1;

    var tempArr = [],
        start = currentPage - (currentPage - 1) % pLimit,
        limit = Math.min(currentPage - (currentPage - 1) % pLimit + (pLimit - 1), totalPage);

    for (start; start <= limit; start++) {
      var active = currentPage === start ? 'active' : '';
      tempArr.push('<li><a data-page="', start, '" class="', active, '" href="#">', start, '</a></li>');
    };
    return ['<div class="m-page">', currentPage <= 1 ? '' : '<span><a href="#" data-page="' + (currentPage - 1) + '"  class="prev"><i class="fas fa-angle-double-left"></i></a></span>', '<ul>', tempArr.join(''), '</ul>', currentPage >= totalPage ? '' : '<span><a href="#" data-page="' + (currentPage + 1) + '" class="next"><i class="fas fa-angle-double-right"></i></a></span>', '</div>'].join('');
  },
      page = function page() {
    return {};
  };
  return {
    tempResults: tempResults,
    tempList: tempList,
    tempPage: tempPage,
    page: page
  };
}(jQuery);

mandy.controller = mandy.controller || {};
mandy.controller.filter = function ($) {
  var $layout = $('body > .content'),
      $sidebar = $layout.find('.m-sidebar'),
      $main = $layout.find('.m-main'),
      data,
      $select,
      $categories,
      pagination = function pagination() {
    var $this = $(this);

    $this.parents('.m-page').find('a').removeClass('active');
    $main.find('.m-items').replaceWith(mandy.view.filter.tempList(data.data, parseInt($(this).data('page')) - 1));
    $main.find('.m-page').replaceWith(mandy.view.filter.tempPage(data.total, $(this).data('page')));

    return false;
  },
      init = function init() {
    mandy.model.filter.getloatData(function (res) {
      data = res;
      $main.append(mandy.view.filter.tempResults(data.total), mandy.view.filter.tempList(data.data), mandy.view.filter.tempPage(data.total));
    });

    $layout.on('click', '.m-page a', pagination);
  };
  return {
    init: init
  };
}(jQuery);

mandy.controller.filter.init();