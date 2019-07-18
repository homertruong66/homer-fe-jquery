var searchModel = {

	// Properties
	criteria: {
	},

	custom_criteria: {
	},

	sort_name: 'id',
	is_sort_asc: true,
	page_index: 1,
	page_size: 10,

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
