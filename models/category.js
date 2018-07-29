const mongoose = require('mongoose');

// Category Schema
const CategorySchema = mongoose.Schema({

	name: {
		type: String, 
		required: true
	}, 
	slug: {
		type: String
	},
	sorting: {
		type: Number
	}
	
});

var Category = module.exports = mongoose.model('Category', CategorySchema);