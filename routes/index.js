const express = require('express');
const router = express.Router();

// Get Product Model
const Product = require('../models/product');

// GET -- Home Page 
router.get('/', (req, res) => {
	res.render('index', { 
		title: 'BluRack | Spirits Company' 
	});
});

// GET -- Contact Page
router.get('/contact-us', (req, res) => {
	res.render('contact', {
		title: 'BluRack | Contact Us'
	});
});

//  GET -- Simple Vodka Page
router.get('/simple-vodka', (req, res) => {
	
	Product.findOne({slug: 'simple-vodka'}, (err, product) => {
		if (err) console.log(err);

		res.render('brands/simple-vodka', {
			title: 'Simple Vodka | BluRack',
			product: product
		});
	});
});

module.exports = router;
