var AdminEditModel = {

    // Properties
    id: '',
    email		: '',
    confirmedEmail: '',
    password	: '',
    confirmedPassword: '',
    firstName		: '',
    lastName	    : '',
    phone	    : '',

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

var AdminSearchModel = searchModel;