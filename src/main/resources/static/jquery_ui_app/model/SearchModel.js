var searchModel = {

	// Properties
	 name: "",

	// Methods
	create: function () {
		$.extend({}, this);
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
