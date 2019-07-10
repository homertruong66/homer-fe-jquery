/**
Response Format: {
  status: int, default = 1
  data : object/array, default = null
  code : int, default = 0
  message : string, default = ''
}
**/

var debugMode = true;

var RequestManager = {

  defaults: {
    callback      : $.noop,
    contentType   : 'application/json; charset=utf-8',
    context       : null,
    dataType      : 'json',
    httpMethod    : 'POST'
  },

  doAjaxRequest: function (options) {
    var opts = $.extend({}, this.defaults, options);

    // validate options
    if ($.isPlainObject(opts.data)) {
      if (opts.dataType == "json") {
        try {
          opts.data = JSON.stringify(opts.data);
        } 
        catch (e) {
          throw e;
        }
      }
    }
    if (debugMode) {
      console.log(new Date().toLocaleString() + ": " + opts.url + (opts.data ? ": " + opts.data : ''));
    }

    // TODO: queue up requests
    $.ajax({
      url         : opts.url,
      type        : opts.httpMethod,
      headers     : opts.headers,
      data        : opts.data,
      dataType    : opts.dataType,
      contentType : opts.contentType,
      
      beforeSend: function (jqXHR, settings) {

      },

      success: function (response, textStatus, jqXHR) {
        // do biz successfully
        if (response.status) {
          // show success message
          console.info(response.message);

          // call callback function
          if ($.isFunction(opts.callback)) {
            opts.callback(response.data, textStatus, jqXHR);
          }
        } 
        // failed
        else {
          // show error message
          alert(response.message);
          console.error(response.message);
        }
      },

      error: function (jqXHR, textStatus, errorThrown) {
        var response;
        try {
          response = JSON.parse(jqXHR.responseText);
          alert(response.message);
        }
        catch (ex) { }

        console.error('AJAX call error with textStatus: "' + textStatus + '" - errorThrown: "' + errorThrown + '"');
      },

      complete: function (jqXHR, textStatus) {
        if ($.isFunction(opts.alwaysCallback)) {
          opts.alwaysCallback(null, textStatus, jqXHR);
        }
      },

      converters: {
        "text json": function (json) {
          return JSON.parse(json, function (key, value) {
            var d = new Date();
            if (typeof value === 'string') {
              // IsoDate: "2008-01-01T12:00:00Z"

              var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(Z*)$/.exec(value);
              if (a) {
                //return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
                dateTime = new Date(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]);
                return new Date(dateTime.getTime() - DATE_OFFSET);
              } else {
                // JsonDate: "\/Date(...)\/"
                a = /\/Date\((\d*)\)\//.exec(value);
                if (a) {
                  dateTime = new Date(+a[1]);
                  return new Date(dateTime.getTime() - DATE_OFFSET);
                }
              }
            }
            return value;
          });
        }
      },
    });
  }
};
