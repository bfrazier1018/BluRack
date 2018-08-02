const express = require('express');
const router = express.Router();
const fs = require('fs-extra');

// Get Product Model
const Product = require('../models/product');
// Get Category Model
const Category = require('../models/category');

// *************************** /brands ********************************

// GET -- All Products
router.get('/', (req, res) => {

	Category.find({}).sort({sorting: 1}).exec((err, categories) => {
		Product.find({}).sort({sorting: 1}).exec((err, products) => {
			if (err) console.log(err);

			res.render('products', {
				title: 'BluRack | Brands',
				products: products,
				categories: categories,
				messages: req.flash('success')
			});
		});
	})
});

// GET -- Products by Category
router.get('/:category', (req, res) => {

	var categorySlug = req.params.category;

	Category.find({}).sort({sorting: 1}).exec((err, categories) => {
		Category.findOne({slug: categorySlug}, (err, category) => {
			Product.find({category: categorySlug}, (err, products) => {
				if (err) console.log(err);

				res.render('cat_products', { 
					title: 'BluRack | '+ category.name,
					categories: categories,
					products: products,
					messages: req.flash('success')
				});		
			});
		});	
	})
});

// GET -- Product Details
router.get('/:category/:product', (req, res) => {
	var galleryImages = null;
	// var loggedIn = (req.isAuthenticated()) ? true : false;

	Product.findOne({slug: req.params.product}, (err, product) => {
		if (err) {
			console.log(err);
		} else {
			var galleryDir = 'public/product_images/' + product._id + '/gallery';
			fs.readdir(galleryDir, (err, files) => {
				if (err) {
					console.log(err);
				} else {
					galleryImages = files;

					res.render('product', {
						title: 'BluRack | ' + product.name,
						product: product,
						galleryImages: galleryImages,
						messages: req.flash('success')
						// loggedIn: loggedIn
					});
				}
			});
		}
	});
});

module.exports = router;