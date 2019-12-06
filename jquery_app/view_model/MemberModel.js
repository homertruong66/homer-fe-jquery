var MemberEditModel = {

  // Properties
  id: '',
  email		: '',
  confirmedEmail: '',
  password	: '',
  confirmedPassword: '',
  firstName		: '',
  lastName	    : '',
  phone	    : '',
  position	    : '',

  // Methods
  create: function () {
    return $.extend({}, this);
  },

  update: function (item) {
    if (item) {
        $.extend(this, item);
    }
  },

  validate: function (errors) {
    
    return true;
  }
};

var MemberSearchModel = searchModel;