var AdminEditModel = {

    // Properties
    id: '',
    email		: '',
    confirmed_email: '',
    password	: '',
    confirmed_password: '',
    first_name		: '',
    last_name	    : '',
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