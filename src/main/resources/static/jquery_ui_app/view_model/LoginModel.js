var LoginModel = {
    // Properties
    email    : '',
    password	: '',

    // Methods
    create: function () {
        return $.extend({}, this);
    },

    validate: function (errors) {

        return true;
    }
}
