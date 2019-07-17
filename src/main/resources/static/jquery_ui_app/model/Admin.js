var AdminEditModel = {

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

var AdminSearchModel = {

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
