var UserController = {

    // Properties
    baseUrl: globalObject.apiUrl + '/v1/users/',
    pagingModel: {},
    viewLogin: '#login',
    viewMain: '#user-section',
    viewList: '#user-list',
    viewTable: '#user-table',
    viewEdit: '#user-edit',

    // Methods
    init: function () {
        this.$viewLogin = $(this.viewLogin);
        this.$viewMain = $(this.viewMain);
        this.$viewList = $(this.viewList);
        this.$viewTable = $(this.viewTable);
        this.$viewEdit = $(this.viewEdit);
    },

    cancelEdit: function (event, $target) {
        this.$viewEdit.hide();
    },

    create: function (event, $target) {
        // 1. disable target
        $target.setEnabled(false);

        // 2. prepare model for the view
        var $view = this.$viewEdit;
        var model = $view.createModel();
        $view.data('model', model);                         // set model to $view to use in save method

        // 3. bind the model to the view
        DataUtil.bind($view, model);

        // 4. do other stuffs
        $view.find('[disabled]').removeAttr('disabled');
        $view.find('[name=confirmedEmailLabel], [name=confirmedPasswordLabel],' +
                   '[name=confirmedEmail], [name=confirmedPassword]').show();

        // 5. show the view
        $view.show();

        // 6. enable target
        $target.setEnabled(true);
    },

    del: function (event, $target) {
        if (!confirm('Are you sure you want to delete?')) {
            return;
        }

        var me = this;
        var options = {};
        options['url'] = this.baseUrl + $target.data('id');
        options['httpMethod'] = 'DELETE',
        options['headers'] = Util.getSecurityTokenHeader();
        options['callback'] = function(result) {
            me.$viewEdit.hide();
            me.get(1);
        }
        RequestManager.doAjaxRequest(options);
    },

    first: function (event, $target) {
        NavigationUtil.goFirst(this);
    },

    get: function (pageIndex, pageSize) {
        var me = this;
        var $view = this.$viewList;
        var searchModel = $view.createModel();
        searchModel['name'] = $('[name=name]', this.$viewList).val();

        if (!pageIndex) {
            pageIndex = $('#page_index', this.$viewList).val();
        }
        searchModel['pageIndex'] = pageIndex;

        if (!pageSize) {
            pageSize = $('#page_size', this.$viewList).val();
        }
        searchModel['pageSize'] = pageSize;

        // TODO: validate model

        var options = {};
        options['url'] = this.baseUrl + 'search';
        options['headers'] = Util.getSecurityTokenHeader();
        options['data'] = searchModel,
        options['callback'] = function(data){
            // store paging model
            me.pagingModel = data;

            // render data to table
            me.$viewTable.empty();
            me.pagingModel.list.forEach(function(item, index) {
                me.$viewTable.append(
                    '<li>' +
                        me.toString(item) +
                        ' <a class="button" href="#/users/' + item.id + '">Update</a> ' +
                        ' <a class="button" data-action="del" data-id="' + item.id + '">Delete</a> ' +
                    '</li>');
            });

            // update UI paging components
            $('#page_index', me.$viewList).val(me.pagingModel.page_index);
            $('#num_of_pages', me.$viewList).text(me.pagingModel.num_of_pages);
        }
        RequestManager.doAjaxRequest(options);
    },

    index: function () {
        var $view = this.$viewMain;
        $.showSection(this, $view);
        $.updateSectionTitle($view);
        this.$viewEdit.hide();
    },

    last: function (event, $target) {
        NavigationUtil.goLast(this);
    },

    login: function (event, $target) {
        var $view = this.$viewLogin;

        // TODO: validate view
//        if ($view.validateForm()) {
//        }
        var model = $view.createModel();
        DataUtil.unbind($view, model);

        var headers = {};
        headers.username = model.username;
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
        localStorage.removeItem(globalObject.headerUserProfileKey);

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

    next: function (event, $target) {
        NavigationUtil.goNext(this);
    },

    onPageIndexChanged: function (event, $target) {
        NavigationUtil.onPageIndexChanged(event, $target, this);
    },

    onPageSizeChanged: function (event, $target) {
        NavigationUtil.onPageSizeChanged(event, $target, this);
    },

    previous: function (event, $target) {
       NavigationUtil.goPrevious(this);
    },

    save: function (event, $target) {
        var me = this;

        // 1. disable target
        $target.setEnabled(false);

        // 2. validate view, if ok unbind data from GUI to model and validate it
        var $view = this.$viewEdit;

        // TODO: validate view
//        if ($view.validateForm()) {
//        }
        var model = $view.data('model');
        DataUtil.unbind($view, model);
//        if (model.validate(errors)) {
//        }
        // 3. prepare post data for AJAX request
        var options = {};
        if (model.id == '') {
            options['url'] = this.baseUrl;
        }
        else {
            options['url'] = this.baseUrl + model.id;
            options['httpMethod'] = 'PUT';
        }
        options['headers'] = Util.getSecurityTokenHeader();
        options['data'] = model,
        options['callback'] = function(result){
            // 5. change view and do other stuffs
            document.location.hash = '#/users';

            // 6. enable target
            $target.setEnabled(true);
        }
        options['alwaysCallback'] = function(){
            $target.setEnabled(true);
        };

        // 4. call method to send request
        RequestManager.doAjaxRequest(options);
    },

    search: function (event, $target) {
        if (event.keyCode != 13) {
            return;
        }

        var pageIndex = $('#page_index', this.$viewList).val();
        var pageSize = $('#page_size', this.$viewList).val();
        this.get(pageIndex, pageSize);
    },

    toString: function (item) {
        return item.email + ' (' + item.roles + ' - ' + item.name;
    },

    update: function (id) {
        var me = this;

        // 1. disable target
        // 2. prepare view to be showed
        var $view = this.$viewEdit;

        var options = {};
        options['url'] = this.baseUrl + id;
        options['httpMethod'] = 'GET',
        options['headers'] = Util.getSecurityTokenHeader();
        options['callback'] = function(entity){
            // 3.prepare model for the view
            var model = $view.createModel();
            model.update(entity);
            $view.data('model', model);					// set model to $view to use in save method

            // 4. bind model to view
            DataUtil.bind($view, model);
            var $options = $('[name=roles] option', me.$viewEdit);
            $options.each(function(index, item) {
                var $item = $(item);
                var role = $item.val();
                if ($.inArray(role, entity.roles) != -1) {
                  $item.prop('selected', true);
                }
                else {
                  $item.prop('selected', false);
                }
            });

            // 5. do other stuffs
            $view.find('[name=email], [name=password]').attr('disabled','disabled');   // don't allow update email and password fields
            $view.find('[name=confirmedEmail], [name=confirmedPassword], ' +
                       '[name=confirmedEmailLabel], [name=confirmedPasswordLabel]').hide();
            $view.show();

            // 6. enable target
        }
        RequestManager.doAjaxRequest(options);
        if (!this.pagingModel.list) {
            this.get();
        }
    }

}
