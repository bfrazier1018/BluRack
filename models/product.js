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
	sku: {
		type: String
	},
	shortDescription: {
		type: String,
		required: true
	},
	description: {
		type: String, 
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
	},
	stockStatus: {
		type: String
	},
	website: {
		type: String 
	},
	facebook: {
		type: String
	},
	weight: {
		type: Number 
	},
	length: {
		type: Number 
	},
	width: {
		type: Number 
	},
	height: {
		type: Number 
	},
	shippingClass: {
		type: String 
	},
	HSTariffNumber: {
		type: String 
	},
	countryOfManufacture: {
		type: String 
	},
	specialServices: {
		type: String 
	},
	alcoholRecipient: {
		type: String
	},
	dangerousGoodsRegulation: {
		type: String 
	},
	dangerousGoodsAccessibility: {
		type: String 
	},
	customDeclaredValue: {
		type: Number 
	},
	freightClass: {
		type: String 
	},
	prePackedProduct: {
		type: Boolean 
	},
	nonStandardProduct: {
		type: Boolean
	}
});

var Product = module.exports = mongoose.model('Product', ProductSchema);