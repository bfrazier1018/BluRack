const express = require('express');
const router = express.Router();

// Get Product Model
const Product = require('../models/product');

// ************************* /cart ****************************

// Get Add Product to Cart
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
		req.flash('success', 'Product Added to Cart!');
		res.redirect('back');
	});
});

// GET Checkout Page
router.get('/checkout', (req, res) => {

	if (req.session.cart && req.session.cart.length == 0 ) {
		delete req.session.cart;
		res.redirect('/cart/checkout');
	} else {
		res.render('checkout', {
			title: 'BluRack | Checkout',
			cart: req.session.cart,
			messages: req.flash('success')
		});
	}
});

// GET Update Product
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
	res.redirect('/cart/checkout');
});

// GET Clear Cart 
router.get('/clear', (req, res) => {

	delete req.session.cart;

	req.flash('success', 'Cart Cleared!');
	res.redirect('/cart/checkout');

});

// GET Buy Now 
router.get('/buynow', (req, res) => {

	delete req.session.cart;

	res.sendStatus(200);

});

module.exports = router;