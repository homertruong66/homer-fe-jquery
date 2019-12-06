
//////  Javascript Extensions  //////

Date.prototype.addMilliseconds = function (millliseconds) {
  return new Date(this.getTime() + millliseconds);
};

Date.prototype.addMinutes = function (minutes) {
  return new Date(this.getTime() + minutes * 60000);
};

Date.prototype.addNDays = function (N) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + N);

  return dat;
};

Date.prototype.addNMonths = function (N) {
  var dat = new Date(this.valueOf());
  dat.setMonth(dat.getMonth() + N);

  return dat;
};

Date.prototype.addNYears = function (N) {
  var dat = new Date(this.valueOf());
  dat.setYear(dat.getFullYear() + N);

  return dat;
};

Date.prototype.addSeconds = function (seconds) {
  return new Date(this.getTime() + seconds * 1000);
};

Date.prototype.isAfter = function (d) {
  return this.getTime() > d.getTime();
};

Date.prototype.isBefore = function (d) {
  return this.getTime() < d.getTime();
};

Date.prototype.isEqual = function (d) {
  return this.getTime() == d.getTime();
};

Date.prototype.format = function (type) {
  var rv;
  if (type == 1) {
    var today = new Date();
    var todayUtc = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(),
								 today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds());
    var diff = todayUtc.toLocalDateTime() - this;
    var rv = diff / 1000;   // second
    if (rv < 60) {
      rv = rv.toFixed(0) + ' second(s) ago';
    }
    else {
      rv = rv / 60;		// minute
      if (rv < 60) {
        rv = rv.toFixed(0) + ' minute(s) ago';
      }
      else {
        rv = rv / 60;       // hour
        if (rv < 24) {
          rv = rv.toFixed(0) + ' hour(s) ago';
        }
        else {
          rv = rv / 24;     // day
          rv = rv.toFixed(0) + ' day(s) ago';
        }
      }
    }
  }
  else if (type == 2) {
    rv = this.getFullYear() + '-' + (this.getMonth() + 1).toString().padLeft('0', 2) + '-' + this.getDate().toString().padLeft('0', 2) + ' ' +
  this.getHours().toString().padLeft('0', 2) + ':' + this.getMinutes().toString().padLeft('0', 2);
  }
  return rv;
}

Date.prototype.subtractDate = function (date) {
  var result = Math.abs(this - date);

  return Math.floor(result / 1000 / 60 / 60 / 24);
};

Date.prototype.toISODateString = function () {
  var d = this;
  return d.getFullYear() + '-' + (d.getMonth() + 1).toString().padLeft('0', 2) + '-' + d.getDate().toString().padLeft('0', 2) + 'T' +
		   d.getHours().toString().padLeft('0', 2) + ':' + d.getMinutes().toString().padLeft('0', 2) + ':' + d.getSeconds().toString().padLeft('0', 2) + 'z';
};

Date.prototype.toLocalDateTime = function () {
  return new Date(this.getTime() - DATE_OFFSET);
}

Number.prototype.round = function (decimals) {
  // round(1.005, 2); // 1.01
  var value = Number(Math.round(this + 'e' + decimals) + 'e-' + decimals);
  if (!value) {
    value = 0;
  }

  return value;
}

Object.equalTo = function (target) {
  if (target == undefined || typeof target != 'object') {
    return false;
  }

  for (var p in this) {
    if (!target.hasOwnProperty(p)) {
      return false;
    }

    var value = this[p], value2 = target[p];
    if (value == value2 || $.isFunction(value)) {
      continue;
    }

    if (typeof value != typeof value2) {
      return false;
    }

    // TODO: check reference type, for example, Array
    if (value != value2) {
      return false;
    }
  }

  return true;
};

String.prototype.getSubString = function (length) {
  var s = new String(this);
  if (s.length > length) {
    var substr = s.substring(0, length);
    substr = s.substring(0, substr.lastIndexOf(' ')) + '...';
    return substr;
  }
  return s;
};

String.prototype.hashCode = function () {
  var hash = 0;
  if (this.length == 0) return hash;
  for (var i = 0; i < this.length; i++) {
    var character = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

String.prototype.isEmail = function (email) {
  // TODO: write regex to check if email is a valid email
  return true;
}

String.prototype.iso2Date = function () {
  var value = this;
  // IsoDate: '2008-01-01T12:00:00Z'
  var d = new Date();
  var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(Z*)$/.exec(value);
  if (a) {

    //return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
    dateTime = new Date(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]);
    return dateTime.toLocalDateTime();
  }
  // JsonDate: '\/Date(...)\/'
  a = /\/Date\((\d*)\)\//.exec(value);
  if (a) {
    dateTime = new Date(+a[1]);
    return dateTime.toLocalDateTime();
  }

  return null;
};

String.prototype.json2Date = function () {
  var offset = 0; // new Date().getTimezoneOffset() * 60000;
  var parts = /\/Date\((-?\d+)([+-]\d{2})?(\d{2})?.*/.exec(this.valueOf());

  if (parts[2] == undefined)
    parts[2] = 0;

  if (parts[3] == undefined)
    parts[3] = 0;

  return new Date(+parts[1] + offset + parts[2] * 3600000 + parts[3] * 60000);
};

String.prototype.makeId = function () {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

String.prototype.padLeft = function (paddingChar, length) {
  var s = new String(this);
  if ((this.length < length) && (paddingChar.toString().length > 0)) {
    for (var i = 0; i < (length - this.length) ; i++)
      s = paddingChar.toString().charAt(0).concat(s);
  }

  return s;
};

String.prototype.parseIntZero = function (str) {
  if (!str) return 0;

  var result;
  try {
    result = parseInt(str);
  }
  catch (err) {
    result = 0;
  }

  return result;
};

String.prototype.trim = function () {
  return this.replace(/^\s*/, '').replace(/\s*$/, '');
};


//////  App Functions  //////

// get entity controller by name
$.getController = function (controllerName) {
  if (controllerName && controllerName.indexOf('Controller') == -1) {
    controllerName += 'Controller';
  }

  var controller = window[controllerName];
  if (!controller) {
    debugger;
    throw 'controller "' + controllerName + '" not found';
  }

  return controller;
};

// show current section
$.showSection = function (controller, $view) {
    globalObject.currentView.hide();
    globalObject.currentView = $view;
    globalObject.currentView.show();
    controller.get();
}


$.updateSectionTitle = function ($view) {
    var $title = $('.page-content .page-header .title');
    var title = $view.data('title');
    $title.text(title ? title : '');
};

$.setActiveTab = function ($tab) {
    // clear active tab
    $('li.tab-panel').removeClass('active');

    // set active tab
    $tab.addClass('active');
};


//////  jQuery Extensions  //////
$.fn.extend({

  createModel: function () {
    var modelName = this.data('model-name');
    var model = window[modelName];
    if (model == undefined || !$.isFunction(model['create'])) {
      throw 'cannot find data-model-name, or invalid model';
    }

    return model.create();
  },

  // get attribute for elements declaring 'data-{name}' tag
  getAttribute: function (name) {
    var attr = this.data(name);
    if (attr == undefined) {
      attr = this.closest('[data-' + name + ']').data(name);
    }

    if (!attr) {
      throw 'cannot find [data-' + name + ']';
    }

    return attr;
  },

  // get controller for views that declare 'data-controller' tag or their parents do
  getController: function () {
    var controllerName = this.data('controller');
    if (controllerName == undefined) {
      controllerName = this.closest('[data-controller]').data('controller');
    }

    return $.getController(controllerName);
  },

  // enable/disable elements
  setEnabled: function (isEnabled) {
    // TODO: check element type
    var $this = $(this);
    if (!$this.is('a') && !$this.is('button')) {
      return;
    }

    if (isEnabled == true) {
      this.removeAttr('disabled');
    }
    else if (isEnabled == false) {
      this.attr('disabled', 'disabled');
    }

    return this;
  },

});
