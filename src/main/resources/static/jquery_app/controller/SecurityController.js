var SecurityController = {

    // Properties
    viewLogin: '#login',

    // Methods
    init: function () {
        this.$viewLogin = $(this.viewLogin);
    },

    login: function (event, $target) {
        var $view = this.$viewLogin;

        // TODO: validate view
//        if ($view.validateForm()) {
//        }
        var model = $view.createModel();
        DataUtil.unbind($view, model);

        var headers = {};
        headers.username = model.email;
        headers.password = model.password;
        $.ajax({
            url         : 'http://localhost:9090/login',
            type        : 'POST',
            headers     : headers,
            dataType    : 'text',
            contentType : 'text/plain',

            success: function (data, textStatus, jqXHR) {
                var tokenKey = globalObject.headerSecurityTokenKey;
                var userProfileKey = globalObject.headerUserProfileKey;
                localStorage[tokenKey] = jqXHR.getResponseHeader(tokenKey);
                localStorage[userProfileKey] = jqXHR.getResponseHeader(userProfileKey);
                $("#login").hide();
                $("#logout").show();
                $("#content").show();

                // init routers
                Starter.initApp();
            }
        });
    },

    logout: function (event, $target) {
        var headers = {};
        headers[globalObject.headerSecurityTokenKey] = localStorage[globalObject.headerSecurityTokenKey];

        // clear local token
        localStorage.removeItem(globalObject.headerSecurityTokenKey);
        localStorage.removeItem(globalObject.headerAdminProfileKey);

        // remove token on server
        $.ajax({
            url         : 'http://localhost:9090/logout',
            type        : 'POST',
            headers     : headers,
            dataType    : 'text',
            contentType : 'text/plain',

            success: function (data, textStatus, jqXHR) {
                $("#login").show();
                $("#logout").hide();
                $("#content").hide();
            }
        });
    },

}
