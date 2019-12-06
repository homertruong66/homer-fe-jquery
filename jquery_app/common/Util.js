var DataUtil = {

  // bind model for a scope, elements in scope must have name attribute
  bind: function (scope, model) {
    for (var name in model) {
      var value = model[name];
      if ($.isArray(value) || $.isPlainObject(value) || $.isFunction(value)) {
        continue;
      }

      if (value == null) {
        value = '';
      }

      $('[name=' + name + ']', scope).each(function () {
        var $ele = $(this);
        if ($ele.is('span')) {
          if ($.type(value) == 'date') {
            // TODO: format based on custom html data tag
            var m = new moment(value);
            value = m.format('DD MMM YYYY');
          }
          $ele.text(value);
        }
        else if ($ele.is('input[type=checkbox]')) {
          $ele.prop('checked', value);
        }
        else if ($ele.is('input[type=radio]')) {
          $ele.each(function () {
            var $this = $(this);
            if ($this.val() == value) {
              $this.prop('checked', 'checked');
            }
            else {
              $this.removeAttr('checked');
            }
          });
        }
        else if ($ele.is('input:not([type=file])') || $ele.is('textarea')) {
          $ele.val(value);
        }
        else if ($ele.is('select')) {
          $('option', $ele).each(function () {
            var $this = $(this);
            if ($this.val() == value) {
              $this.attr('selected', 'selected');
            }
            else {
              $this.removeAttr('selected');
            }
          });
        }
      });
    }
  },

  // unbind data from elements in a scope to a model, elements in scope must have name attribute
  unbind: function (scope, model) {
    model.error = '';
    $('input.field:not(:disabled), ' +
      'textarea.field:not(:disabled), ' +
      'select:not(:disabled)', scope).each(function () {
          var $ele = $(this);
          var name = $ele.attr('name');
          var value = null;
          if ($ele.is('input[type=checkbox]')) {
            value = $ele.prop('checked');
          }
          else if ($ele.is('input[type=radio]')) {
            if ($ele.is('input[type=radio]:checked')) {
              value = $ele.val();
            }
          }
          else {
            value = $ele.val();
            if (value && value.trim) {
              value = value.trim();
            }
          }

          if (value != null) {
            model[name] = value;
          }

          //data-required='true'
          var required = $ele.data('required');
          if (required && (!value || value == '')) {
            model.error += name + ' is required.\n';
            return;
          }

          //data-validation-matches-match
          var type = $ele.data('validation-matches-match');
          if (type == 'email') {
            //check valid email
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            if (!emailReg.test($ele.val())) {
              //Get error message
              var errorMessage = $ele.data('validation-matches-message');
              if (errorMessage == '') {
                errorMessage = 'Please enter a valid email address.';
              }
              model.error += errorMessage + '\n';
            }
          }
    });
  }
};

var NavigationUtil = {

    goFirst: function (controller) {
        var pageIndex = $('#pageIndex', controller.$viewList).val();
        if (pageIndex == 1) {
            return;
        }

        pageIndex = 1;
        var pageSize = $('#pageSize', controller.$viewList).val();
        controller.get(pageIndex, pageSize);
    },

    goLast: function (controller) {
        var pageIndex = $('#pageIndex', controller.$viewList).val();
        if (pageIndex == controller.pagingModel.numOfPages) {
            return;
        }

        var pageIndex = controller.pagingModel.numOfPages;
        var pageSize = $('#pageSize', controller.$viewList).val();
        controller.get(pageIndex, pageSize);
    },

    goNext: function (controller) {
        var pageIndex = $('#pageIndex', controller.$viewList).val();
        if (pageIndex == controller.pagingModel.numOfPages) {
            return;
        }

        pageIndex++;
        var pageSize = $('#pageSize', controller.$viewList).val();
        controller.get(pageIndex, pageSize);
    },

    onPageIndexChanged: function (event, $target, controller) {
        if (event.keyCode != 13) {
            return;
        }

        var pageIndex = parseInt($target.val());
        if (pageIndex < 1 || pageIndex > controller.pagingModel.numOfPages) {
            alert('Invalid page index')
            return;
        }
        var pageSize = $('#pageSize', controller.$viewList).val();
        controller.get(pageIndex, pageSize);
    },

    onPageSizeChanged: function (event, $target, controller) {
        var pageIndex = 1;
        var pageSize = parseInt($target.val());
        controller.get(pageIndex, pageSize);
    },

    goPrevious: function (controller) {
        var pageIndex = $('#pageIndex', controller.$viewList).val();
        if (pageIndex == 1) {
            return;
        }

        pageIndex--;
        var pageSize = $('#pageSize', controller.$viewList).val();
        controller.get(pageIndex, pageSize);
    }

}

var Util = {

    getSecurityTokenHeader: function () {
        var securityTokenHeader = {};
        securityTokenHeader[globalObject.headerSecurityTokenKey] = localStorage[globalObject.headerSecurityTokenKey];

        return securityTokenHeader;
    },

    getUserProfile: function () {
        return JSON.parse(localStorage[globalObject.headerUserProfileKey]);
    },

    upload: function ($fileInput, url) {
        $fileInput.simpleUpload(url, {
            start: function(file){
                //upload started
                $('#progress').html("");
                $('#progressBar').width(0);
            },

            progress: function(progress){
                //received progress
                $('#progress').html("Progress: " + Math.round(progress) + "%");
                $('#progressBar').width(progress + "%");
            },

            success: function(data){
                //upload successful
                $('#progress').html("Success!<br>Data: " + JSON.stringify(data));
            },

            error: function(error){
                //upload failed
                $('#progress').html("Failure!<br>" + error.name + ": " + error.message);
            }
        });
    }

}
