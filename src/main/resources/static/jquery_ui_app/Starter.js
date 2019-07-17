Starter = {

    registerListeners: function () {
        // register handlers for action elements
        $(document).on('click change keydown', '[data-action]', function (event) {
            var $this = $(this);

            // filter event on specific element
            if (event.type == 'click') {
                if ($this.is('form') || $this.is('input[type=text]') || $this.is('input[type=password]') || $this.is('select')) {
                    return;
                }

                // bypass fake mouse event
                if (event.originalEvent) {
                    if (event.originalEvent.clientX == 0 && event.originalEvent.clientY == 0) {
                        return;
                    }
                }
            }
            else if (event.type == 'change') {
                if ($this.is('form') || $this.is('input[type=text]') || $this.is('input[type=password]')) {
                    return;
                }
            }
            else if (event.type == 'keydown') {
                if ($this.is('form') || $this.is('input[type=button]') || $this.is('input[type=text]') || $this.is('input[type=password]') || $this.is('a')) {
                    if (event.keyCode != 13) {
                        return;
                    }
                }
                if ($this.is('select')) {
                    return;
                }
            }

            // perform action
            var action = $this.data('action'), controller = $this.getController();
            var actionFunction = controller[action];
            if ($.isFunction(actionFunction)) {
                actionFunction.call(controller, event, $this);	// preserve 'this' as controller in controller's method

                //Set Active Tab
                var $tab = $this.closest('li.tab-panel');
                if($tab.length) {
                    $.setActiveTab($tab);
                }
            }
            else {
                console.log("Element '" + this.type + "' has handler '" + $this.attr("data-action") + "' is not a function.");
            }
        });
    },

    initApp: function () {
        // update User profile
        var userProfile = Util.getUserProfile();
        $('#loggedAdmin').text(userProfile.name);

        // init sections
        globalObject.currentView = $('#intro');
        SecurityController.init();
        AdminController.init();
        MemberController.init();

        // init routers
        var app = $.sammy(function() {
            this.get('#/', function(context) {
                globalObject.currentView = $('#intro');
                globalObject.currentView.show();
            });

            // Admin
            this.get('#/admins', function(context) {
                AdminController.index();
            });

            this.get('#/admins/:id', function(context) {
                var id = this.params['id'];
                AdminController.update(id);
            });

            // Member
            this.get('#/members', function(context) {
                MemberController.index();
            });

            this.get('#/members/:id', function(context) {
                var id = this.params['id'];
                MemberController.update(id);
            });
        });
        app.run('#/');
    }

}

$(function() {
    // register listeners for login and all app
    Starter.registerListeners();

    // check if security token exists
    var headerSecurityToken = localStorage[globalObject.headerSecurityTokenKey];
    if (headerSecurityToken) {
        // hide login view and show others
        $("#login").hide();
        $("#logout").show();
        $("#content").show();

        // init routers
        Starter.initApp();
    }
    else {
        // init SecurityController for login function
        SecurityController.init();
    }

    // register listener for member upload form
    $("#member_upload_form").submit(function(){
        var formData = new FormData($(this)[0]);
        $.ajax({
            url: 'http://localhost:9090/v1/members/upload',
            type: 'POST',
            headers: Util.getSecurityTokenHeader(),
            data: formData,
            success: function (data) {
                alert(data);
                MemberController.get();
            },
            cache: false,
            contentType: false,
            processData: false
        });

        return false;
    });
});
