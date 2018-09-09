const express = require('express');
const router = express.Router();

// Get Product Model
const Product = require('../models/product');
const Order = require('../models/order');

// ************************* /cart ****************************

// GET -- Cart Page
router.get('/', (req, res) => {

	if (req.session.cart && req.session.cart.length == 0 ) {
		delete req.session.cart;
		res.redirect('/cart');
	} else {
		res.render('cart', {
			title: 'BluRack | Cart',
			cart: req.session.cart,
			messages: req.flash('success')
		});
	}
});

// GET -- Checkout Page
router.get('/checkout', (req, res) => {

	if (typeof req.session.cart == 'undefined' || req.session.cart.length == 0 ) {
		delete req.session.cart;
		res.redirect('/cart');
	} else {
		var firstName = "";
		var lastName = "";
		var company = "";
		var country = "";
		var address = "";
		var unitNumber = "";
		var city = "";
		var state = "";
		var zip = "";
		var phone = "";
		var email = "";

		res.render('checkout', {
			title: 'BluRack | Checkout',
			cart: req.session.cart,
			firstName: firstName,
			lastName: lastName,
			phone: phone,
			email: email,
			company: company,
			country: country,
			address: address,
			unitNumber: unitNumber,
			city: city,
			state: state,
			zip: zip,
		});
	}
	// delete req.session.cart;

	// res.sendStatus(200);

});

// GET -- Add Product to Cart
router.get('/add/:product', (req, res) => {
  
	var slug = req.params.product;

	Product.findOne({slug : slug}, (err, product) => {
		if (err) console.log(err);

		// If Cart is Empty
		if (typeof req.session.cart == "undefined") {
			req.session.cart = [];
			req.session.cart.push({
				name: slug,
				qty: 1, 
				price: parseFloat(product.price).toFixed(2),
				image: '/product_images/' + product._id + '/' + product.image
			});
		} else {
			var cart = req.session.cart;
			var newItem = true;

			for (var i = 0; i < cart.length; i++) {
				if (cart[i].name == slug) {
					cart[i].qty++;
					newItem = false;
					break;
				} 
			}

			if (newItem) {
				cart.push({
					name: slug,
					qty: 1, 
					price: parseFloat(product.price).toFixed(2),
					image: '/product_images/' + product._id + '/' + product.image
				});
			}
		}

		// console.log(req.session.cart);
		req.flash('success', product.name + ' Added to Cart!');
		res.redirect('/cart');
	});
});

// GET -- Update Product
router.get('/update/:product', (req, res) => {

	var slug = req.params.product;
	var cart = req.session.cart;
	var action = req.query.action;

	for (var i = 0; i < cart.length; i++) {
		if (cart[i].name == slug) {
			switch(action) {
				case "add":
					cart[i].qty++;
					break;
				case "subtract":
					cart[i].qty--;
					if (cart[i].qty < 1) cart.splice(i, 1);
					break;
				case "clear":
					cart.splice(i, 1);
					if (cart.length == 0) delete req.session.cart;
					break;
				default:
					console.log('Update Problem');
					break;
			}
			break;
		}
	}

	req.flash('success', 'Cart Updated!');
	res.redirect('/cart');
});

// GET -- Clear Cart 
router.get('/clear', (req, res) => {

	delete req.session.cart;

	req.flash('success', 'Cart Cleared!');
	res.redirect('/cart');

});

// GET -- Checkout Page 
router.get('/checkout/paypal', (req, res) => {

	delete req.session.cart;
	res.sendStatus(200);

});

// POST - New Order
router.post('/checkout/pay', (req, res) => {
  
  	// Express Validator
  	req.checkBody('firstName', 'First Name must have a value').notEmpty();
  	req.checkBody('lastName', 'Last Name must have a value').notEmpty();
  	req.checkBody('email', 'Email must have a value').notEmpty();
  	req.checkBody('phone', 'Phone must have a value').notEmpty();
  	req.checkBody('address', 'Address must have a value').notEmpty();
  	req.checkBody('city', 'Town / City must have a value').notEmpty();
  	req.checkBody('zip', 'Zip must have a value').notEmpty();

	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.email;
	var phone = req.body.phone;
	var company = req.body.company;
	var country = req.body.country;
	var address = req.body.address;
	var unitNumber = req.body.unitNumber; 
	var city = req.body.city; 
	var state = req.body.state; 
	var zip = req.body.zip; 

	var errors = req.validationErrors();

	if (errors) {
		res.render('checkout', {
			errors: errors,
			title: 'BluRack | Checkout',
			cart: req.session.cart,
			firstName: firstName,
			lastName: lastName,
			phone: phone,
			email: email,
			company: company,
			country: country,
			address: address,
			unitNumber: unitNumber,
			city: city,
			state: state,
			zip: zip,
		});
	} else {
		// Create New Order
	  	var order = new Order({
	  		firstName: firstName,
	  		lastName: lastName,
			email: email,
			phone: phone,
			company: company,
			country: country,
			address: address,
			unitNumber: unitNumber,
			city: city,
			state: state,
			zip: zip,
			date: new Date("2015-03-25T12:00"),
	  	});

	  	// Save Order
	  	order.save((err) => {
	  		if (err) console.log(err);

	  		delete req.session.cart;

	  		res.redirect('/cart');
			// res.sendStatus(200);
	  	});
  	}
});


module.exports = router;