var LoginModel = {
    // Properties
    username    : '',
    password	: '',

    // Methods
    create: function () {
        return $.extend({}, this);
    },

    validate: function (errors) {

        return true;
    }
}

var UserEditModel = {

    // Properties
    id: '',
    email		: '',
    confirmedEmail: '',
    password	: '',
    confirmedPassword: '',
    name		: '',
    age	    : '',
    roles     : [],

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

var UserSearchModel = {

    // Properties
    name		: '',
    sortName  : 'name',
    sortDirection : 'asc',
    pageIndex : 1,
    pageSize  : 4,

    // Methods
    create: function () {
        return $.extend({}, this);
    },

    validate: function (errors) {

        return true;
    }
};
