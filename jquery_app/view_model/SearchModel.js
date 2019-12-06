var searchModel = {

	// Properties
	criteria: {
	},

	customCriteria: {
	},

	sortName: 'id',
	isSortAsc: true,
	pageIndex: 1,
	pageSize: 10,

	// Methods
	create: function () {
		return $.extend({}, this);
	},

	equals: function (model) {		
		return Object.equalTo(model);
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
