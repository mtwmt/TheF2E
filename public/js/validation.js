'use strict';

var mandy = mandy || {};
mandy.model = mandy.model || {};
mandy.model.validation = function ($) {
  var getDistrict = function getDistrict(obj) {
    $.ajax({
      url: '../json/zip.json',
      method: 'get',
      dataType: 'json',
      success: function success(data) {
        // console.log( data );
        obj.success(data);
      }
    });
  };
  return {
    getDistrict: getDistrict
  };
}(jQuery);

mandy.view = mandy.view || {};
mandy.view.validation = function ($) {
  var init = function init() {

    // return $validation;
  };
  return {
    init: init
  };
}(jQuery);

mandy.controller = mandy.controller || {};
mandy.controller.validation = function ($) {
  var $selcity = $('#city'),
      $seldist = $('#dist'),
      $showimage = $('<div class="add-images" />').appendTo($('page-step3 .form')),
      addFile = [],
      $alert = $('page-step3 .alert-msg'),

  // setp3
  showImage = function showImage(list) {
    $showimage.empty();
    list.map(function (e, i) {
      $showimage.append('<figure><img src="' + URL.createObjectURL(e) + '"></figure>');
    });
  },

  // setp3 驗証圖檔尺寸
  checkImage = function checkImage(img, callback) {
    if (img.length <= 3) {
      img.every(function (e) {
        if (e.width <= 150 || e.height <= 150) {
          $alert.hide();
          callback(img);
        } else {
          $alert.show().find('p').text('ONE FILE IS OVER THE MAXIMUM SIZE');
        }
      });
    }
  },
      init = function init() {
    // 縣市下拉
    mandy.model.validation.getDistrict({
      success: function success(data) {
        data.map(function (e, i) {
          $selcity.append('<option value="' + i + '">' + e.label + '</option>');
        });
        $selcity.on('change', function () {
          var idx = $(this).val();
          $seldist.empty();
          data[idx].area.map(function (e, i) {
            $seldist.append('<option value="' + e.zip + '">' + e.label + '</option>');
          });
        });
      }
    });

    $('[data-from][data-to]').each(function (i, e) {
      console.log($(e).data('from'));
      var i = $(e).data('from');
      for (i; i <= $(e).data('to'); i++) {
        $(e).append('<option value="' + i + '">' + i + '</option>');
      }
    });

    $('[type="file"]').on('change', function () {
      var selectFile = [].slice.call(this.files);
      if (addFile.length + selectFile.length <= 3) {
        var task = [];

        // Promise  處理非同步
        selectFile.map(function (e, i) {
          task.push(new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
              resolve({ width: this.width, height: this.height });
            };
            img.onerror = function (e) {
              reject(e.type);
            };
            img.src = URL.createObjectURL(e);
          }));
        });

        Promise.all(task).then(function (result) {
          checkImage(result, function () {
            selectFile.map(function (e, i) {
              addFile.push(e);
            });
            showImage(addFile);
          });
        });
        $alert.hide();
      } else {
        $alert.show().find('p').text('ONE FILE IS OVER THE MAXIMUM SIZE');
      }
    });

    $('page-step3').on('click', '.add-images > figure', function () {
      var idx = $(this).index();
      addFile.splice(idx, 1);
      showImage(addFile);
      $alert.hide();
    });

    $('page-step1').validate({
      success: function success() {
        $('page-step1').hide();
        $('page-step2').show();
      }
    });

    $('page-step2').validate({
      success: function success() {
        $('page-step2').hide();
        $('page-step3').show();
      }
    });
    $('page-step4').validate({
      success: function success() {
        $('page-step4').hide();
        $('page-step5').show();
      }
    });

    $('page-step3').on('click', '[data-submit]', function () {
      console.log('submit', addFile);
      if (!addFile.length) {
        $alert.show().find('p').text('Update Your Photo');
      } else if (addFile.length === 3) {
        $alert.hide();
        $('page-step3').hide();
        $('page-step4').show();
      }
    });
  };
  return {
    init: init
  };
}(jQuery);

mandy.controller.validation.init();