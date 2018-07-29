const mongoose = require('mongoose');

// Product Schema
const ProductSchema = mongoose.Schema({

	name: {
		type: String, 
		required: true
	}, 
	slug: {
		type: String
	}, 
	sorting: {
		type: Number
	},
	description: {
		type: String, 
		required: true
	}, 
	category: {
		type: String, 
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	image: {
		type: String
	}
});

var Product = module.exports = mongoose.model('Product', ProductSchema);