var express = require('express');
var router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');

// Get Product Model
const Product = require('../models/product.js');
// Get Category Model
const Category = require('../models/category.js');

// ----------------------- /admin/products -------------------

// GET -- All Products
router.get('/', (req, res) => {
    var count;

    Product.count((err, c) => {
        count = c;
    });

    Product.find( (err, products) => {
        res.render('admin/products', {
            title: 'All Products',
            products: products,
            count: count,
            messages: req.flash('success')
        });
    });
});

// GET -- Add Product
router.get('/add-product', (req, res) => {

    var name = "";
    var desc = "";
    var price = "";
    var sku = "";
    var description = "";
    var website = "";
    var company = "";
    var facebook = "";
    var twitter = "";
    var instagram = "";

    Category.find( (err, categories) => {
        res.render('admin/add_product', {
            title: 'Add Product',
            name: name, 
            description: description,
            categories: categories,
            price: price,
            sku: sku,
            website: website,
            company: company,
            facebook: facebook,
            twitter: twitter,
            instagram: instagram,
            messages: []
        });
    });
});

// POST -- Add Product
router.post('/add-product', (req, res) => {

    var imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : '';

    // Express Validator
    req.checkBody('name', 'Name must have a value!').notEmpty();
    req.checkBody('description', 'Description must have a value!').notEmpty();
    req.checkBody('price', 'Price must have a value!').isDecimal();
    req.checkBody('image', 'You must upload an image!').isImage(imageFile);

    var name = req.body.name;
    var slug = name.replace(/\s+/g, '-').toLowerCase();
    var description = req.body.description;
    var price = req.body.price;
    var category = req.body.category;

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        Category.find( (err, categories) => {
            res.render('admin/add_product', {
                errors: errors,
                title: 'Add Product',
                name: name, 
                description: description,
                categories: categories,
                price: price,
                messages: []
            });
        });
    } else {
        // Check if Slug Already Exists
        Product.findOne({ slug: slug }, (err, product) => {
            if (product) {
                req.flash('danger', 'Product Name Exists, Choose Another');
                Category.find( (err, categories) => {
                    res.render('admin/add_product', {
                        title: 'Add Product', 
                        name: name,
                        description: description,
                        categories: categories,
                        price: price,
                        messages: req.flash('danger')
                    });
                });
            } else {
                var priceFormated = parseFloat(price).toFixed(2);
                var product = new Product({
                    name: name,
                    slug: slug,
                    description: description,
                    price: priceFormated,
                    category: category,
                    image: imageFile
                });
                // Save Product
                product.save(function(err) {
                    if (err) 
                        return console.log(err);

                    mkdirp('public/product_images/' + product.slug, (err) => {
                        return console.log(err);
                    });

                    mkdirp('public/product_images/' + product.slug + '/gallery', (err) => {
                        return console.log(err);
                    });

                    mkdirp('public/product_images/' + product.slug + '/gallery/thumbs', (err) => {
                        return console.log(err);
                    });

                    if (imageFile != "") {
                        var productImage = req.files.image;
                        var path = 'public/product_images/' + product.slug + '/' + imageFile; 

                        productImage.mv(path, (err) => {
                            return console.log(err);
                        });
                    }

                    req.flash('success', 'Product Added Successfully!');
                    res.redirect('/admin/products');
                });
            }
        });     
    }
});

module.exports = router;


