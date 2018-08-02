const mongoose = require('mongoose');

// Order Schema
const OrderSchema = mongoose.Schema({

	firstName: {
		type: String, 
		required: true
	}, 
	lastName: {
		type: String, 
		required: true
	}, 
	email: {
		type: String, 
		required: true
	}, 
	phone: {
		type: String, 
		required: true
	},
	company: {
		type: String, 
	}, 
	country: {
		type: String, 
		required: true
	}, 
	address: {
		type: String, 
		required: true
	}, 
	unitNumber: {
		type: String, 
	}, 
	city: {
		type: String, 
		required: true
	},
	state: {
		type: String, 
		required: true
	}, 
	zip: {
		type: String, 
		required: true
	}, 
	// products: {
	// 	type: Object,
	// 	required: true
	// },
	// subtotal: {
	// 	type: Number,
	// 	required: true
	// },
	// shipping: {
	// 	type: String, 
	// 	required: true
	// }, 
	// totalPrice: {
	// 	type: String, 
	// 	required: true
	// }, 
	date: {
		type: Date, 
		required: true
	}, 
});

var Order = module.exports = mongoose.model('Order', OrderSchema);