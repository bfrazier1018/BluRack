const mongoose = require('mongoose');

// Category Schema
const CategorySchema = mongoose.Schema({

	name: {
		type: String, 
		required: true
	}, 
	slug: {
		type: String
	}
	
});

var Category = module.exports = mongoose.model('Category', CategorySchema);