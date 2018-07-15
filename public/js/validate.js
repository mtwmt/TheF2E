'use strict';

(function ($) {
  $.fn.validate = function (options) {

    options = $.extend({
      success: function success() {
        alert('success');
      },
      error: function error() {},
      errcls: 'err-msg',
      verifycls: 'field'
    }, options);

    var $form = $(this),
        $verify = $form.find('[data-verify]'),
        $submit = $form.find('[data-submit]'),
        check = {
      name: function name(obj, callback) {
        var val = obj.val,
            reg = RegExp(/^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/);
        if (!reg.test(val)) {
          callback('error');
        }
      },
      mail: function mail(obj, callback) {
        var val = obj.val,
            reg = RegExp(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);
        if (!reg.test(val)) {
          callback('error');
        }
      },
      mobile: function mobile(obj, callback) {
        var val = obj.val,
            reg = RegExp(/^09[0-9]{8}$/);
        if (!reg.test(val)) {
          callback('error');
        }
      },
      password: function password(obj, callback) {
        var val = obj.val,
            min = obj.min,
            max = obj.max,
            reg = RegExp('[a-zA-Z0-9_-]{' + min + ',' + max + '}$');

        if (!reg.test(val)) {
          callback('error');
        }
      },
      confirm: function confirm(obj, callback) {
        var val = obj.val,
            $target = $('[data-verify=password]'),
            reg = RegExp('' + $target.find('input').val());

        if (!reg.test(val)) {
          callback('error');
        }
      },
      addr: function addr(obj, callback) {
        var val = obj.val,
            reg = RegExp(/[\u4e00-\u9fa5]/);
        if (!reg.test(val)) {
          callback('error');
        }
      },
      credit: function credit(obj, callback) {
        var val = obj.val,
            val = val.replace(/\s/g, '');
        if (/^5[1-5][0-9]{14}$/.test(val)) {
          callback('master');
        } else if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(val)) {
          callback('visa');
        } else {
          callback('error');
        }
      }
    },
        actValidate = function actValidate(e) {
      var $self = $(this),
          cls = options.verifycls,
          val = e.target.value,
          msg = $self.data('msg') || $self.find('[data-msg]').data('msg');

      $self.removeClass().addClass(cls);

      for (var i in check) {
        if (i.indexOf($self.data('verify')) >= 0) {
          if (i === 'credit') {
            val = val.replace(/\s/g, '');
            val = val.replace(/(\d{4})/g, '$1 ');
            $self.find('input').val(val);
          }

          $self.find('.' + options.errcls).remove();
          check[i]({
            val: val || '',
            min: $self.data('min') || '',
            max: $self.data('max') || ''
          }, function (data) {
            $self.addClass(data);
            if (data === 'error') {
              $self.append('<em class="' + options.errcls + '">' + msg + '</em>');
            }
          });
        }
      }
    },
        actSubmit = function actSubmit() {
      var log = [];
      $verify.each(function (i, e) {
        if ($(this).hasClass('error') || !$(this).find('input').val()) {
          $(this).addClass('error');
          log.push('err');
        }
      });

      if (!log.length) {
        $(this).one('success', options.success).trigger('success');
      } else {
        $(this).one('error', options.error).trigger('error');
      }
      return false;
    };

    $verify.on('test', actValidate).on('input', 'input', function () {
      $(this).trigger('test');
    });
    $submit.on('click', actSubmit);
  };
})(jQuery);