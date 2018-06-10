'use strict';

var mandy = mandy || {};

mandy.public = function ($) {
  var d = new Date(),
      $inputfile = $('[data=check-file]'),
      init = function init() {
    console.log(123);
    $inputfile.on('change', 'input', function () {
      $(this).parent().find('.fileinfo').empty();
      $(this).after(function () {
        var d = new Date(),
            date = d,
            temp = [];

        temp.push('<div class="fileinfo">', '<p class="name">', $(this).val(), '</p>', '<p class="date">', date, '</p>', '</div>');
        return temp.join('');
      });
      console.log($(this).val());
    });
  };
  return {
    init: init
  };
}(jQuery);

mandy.addTask = function ($) {
  var init = function init() {
    $('.add').on('click', function () {
      $(this).parent().addClass('is-active');
    });
    $('.save,.cancel').on('click', function () {
      $(this).parents('.m-addtask').removeClass('is-active');
    });
    console.log(456);
  };
  return {
    init: init
  };
}(jQuery);

mandy.public.init();
mandy.addTask.init();