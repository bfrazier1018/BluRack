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

    Category.find({}).sort({sorting: 1}).exec((err, categories) => {
        Product.find({}).sort({sorting: 1}).exec((err, products) => {
            if (err) console.log(err);

            res.render('admin/products', {
                title: 'All Products',
                categories: categories,
                products: products,
                count: count,
                messages: req.flash('success')
            });
        });
    });
});

// Sort Products Function
function sortProducts(ids, callback) {

    var count = 0;

    for (let i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;

        (function(count) {
            Product.findById(id, (err, product) => {
                product.sorting = count;
                product.save((err) => {
                    if (err) console.log(err);
                    count++;
                    if (count >= ids.length) {
                        callback();
                    }
                });
            });
        })(count);
    }
};

// POST -- Reorder Products
router.post('/reorder-products', (req, res) => {

    var ids = req.body['id[]'];

    sortProducts(ids, () => {
        Product.find({}).sort({sorting: 1}).exec(function(err, products) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.products = products;
            }
        });
    });
});

// GET -- Add Product
router.get('/add-product', (req, res) => {

    var name = "";
    var price = "";
    var sku = "";
    var shortDescription = "";
    var description = "";
    var stockStatus = "";
    var website = "";
    var facebook = "";
    var weight = "";
    var length = "";
    var width = width;
    var height = "";
    var countryOfManufacture = "";
    var shippingClass = "";
    var HSTariffNumber = "";
    var specialServices = "";
    var alcoholRecipient = "";
    var dangerousGoodsRegulation = "";
    var dangerousGoodsAccessibility = "";
    var customDeclaredValue = "";
    var freightClass = "";
    var prePackedProduct = "";
    var nonStandardProduct = "";

    Category.find({}).sort({sorting: 1}).exec((err, categories) => {
        res.render('admin/add_product', {
            title: 'Add Product',
            name: name,
            categories: categories,
            price: price,
            sku: sku,
            shortDescription: shortDescription, 
            description: description,
            stockStatus: stockStatus,
            website: website,
            facebook: facebook,
            weight: weight,
            length: length,
            width: width,
            height: height,
            shippingClass: shippingClass,
            HSTariffNumber: HSTariffNumber,
            countryOfManufacture: countryOfManufacture,
            specialServices: specialServices,
            alcoholRecipient: alcoholRecipient,
            dangerousGoodsRegulation: dangerousGoodsRegulation,
            dangerousGoodsAccessibility: dangerousGoodsAccessibility,
            customDeclaredValue: customDeclaredValue,
            freightClass: freightClass,
            prePackedProduct: prePackedProduct,
            nonStandardProduct: nonStandardProduct,
            messages: []
        });
    });
});

// POST -- Add Product
router.post('/add-product', (req, res) => {

    var imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : '';

    // Express Validator
    req.checkBody('name', 'Name must have a value!').notEmpty();
    req.checkBody('shortDescription', 'Short Description must have a value!').notEmpty();
    req.checkBody('price', 'Price must have a value!').isDecimal();
    req.checkBody('image', 'You must upload an image!').isImage(imageFile);

    var name = req.body.name;
    var slug = name.replace(/\s+/g, '-').toLowerCase();
    var sku = req.body.sku;
    var shortDescription = req.body.shortDescription;
    var description = req.body.description;
        if (description === "") {
            description = shortDescription;
        }
    var category = req.body.category;
    var price = req.body.price;
    var stockStatus = req.body.stockStatus;
    var website = req.body.website;
    var facebook = req.body.facebook;
    var weight = req.body.weight;
    var length = req.body.length;
    var width = req.body.width;
    var height = req.body.height;
    var countryOfManufacture = req.body.countryOfManufacture;
    var shippingClass = req.body.shippingClass;
    var HSTariffNumber = req.body.HSTariffNumber;
    var specialServices = req.body.specialServices;
    var alcoholRecipient = req.body.alcoholRecipient;
    var dangerousGoodsRegulation = req.body.dangerousGoodsRegulation;
    var dangerousGoodsAccessibility = req.body.dangerousGoodsAccessibility;
    var customDeclaredValue = req.body.customDeclaredValue;
    var freightClass = req.body.freightClass;
    var prePackedProduct = req.body.prePackedProduct;
    var nonStandardProduct = req.body.nonStandardProduct;

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        Category.find((err, categories) => {
            res.render('admin/add_product', {
                errors: errors,
                title: 'Add Product',
                name: name,
                sku: sku,
                categories: categories,
                shortDescription: shortDescription,
                description: description,
                website: website, 
                facebook: facebook,
                weight: weight,
                length: length,
                width: width, 
                height: height,
                shippingClass: shippingClass,
                HSTariffNumber: HSTariffNumber,
                countryOfManufacture: countryOfManufacture,
                specialServices: specialServices,
                alcoholRecipient: alcoholRecipient,
                dangerousGoodsRegulation: dangerousGoodsRegulation,
                dangerousGoodsAccessibility: dangerousGoodsAccessibility,
                customDeclaredValue: customDeclaredValue,
                freightClass: freightClass,
                prePackedProduct: prePackedProduct,
                nonStandardProduct: nonStandardProduct,
                price: price,
                messages: []
            });
        });
    } else {
        // Check if Product Name Already Exists
        Product.findOne({ slug: slug }, (err, product) => {
            if (product) {
                req.flash('danger', 'Product Name Exists, Choose Another');
                Category.find( (err, categories) => {
                    res.render('admin/add_product', {
                        title: 'Add Product', 
                        name: name,
                        categories: categories,
                        price: price,
                        sku: sku,
                        shortDescription: shortDescription, 
                        description: description,
                        stockStatus: stockStatus,
                        website: website,
                        facebook: facebook,
                        weight: weight,
                        length: length,
                        width: width,
                        height: height,
                        shippingClass: shippingClass,
                        HSTariffNumber: HSTariffNumber,
                        countryOfManufacture: countryOfManufacture,
                        specialServices: specialServices,
                        alcoholRecipient: alcoholRecipient,
                        dangerousGoodsRegulation: dangerousGoodsRegulation,
                        dangerousGoodsAccessibility: dangerousGoodsAccessibility,
                        customDeclaredValue: customDeclaredValue,
                        freightClass: freightClass,
                        prePackedProduct: prePackedProduct,
                        nonStandardProduct: nonStandardProduct,
                        messages: req.flash('danger')
                    });
                });
            } else {
                var priceFormated = parseFloat(price).toFixed(2);
                var product = new Product({
                    name: name,
                    slug: slug,
                    sorting: 300,
                    category: category,
                    sku: sku,
                    shortDescription: shortDescription,
                    description: description,
                    price: priceFormated,
                    image: imageFile,
                    stockStatus: stockStatus,
                    website: website,
                    facebook: facebook,
                    weight: weight,
                    length: length,
                    width: width,
                    height: height,
                    shippingClass: shippingClass,
                    HSTariffNumber: HSTariffNumber,
                    countryOfManufacture: countryOfManufacture,
                    specialServices: specialServices,
                    alcoholRecipient: alcoholRecipient,
                    dangerousGoodsRegulation: dangerousGoodsRegulation,
                    dangerousGoodsAccessibility: dangerousGoodsAccessibility,
                    customDeclaredValue: customDeclaredValue,
                    freightClass: freightClass,
                    prePackedProduct: prePackedProduct,
                    nonStandardProduct: nonStandardProduct
                });
                // Save Product
                product.save(function(err) {
                    if (err) 
                        return console.log(err);

                    // Create Image Folders to Store Image and Gallery Images
                    mkdirp('public/product_images/' + product._id, (err) => {
                        return console.log(err);
                    });

                    mkdirp('public/product_images/' + product._id + '/gallery', (err) => {
                        return console.log(err);
                    });

                    mkdirp('public/product_images/' + product._id + '/gallery/thumbs', (err) => {
                        return console.log(err);
                    });

                    console.log('-------- Image File:' + imageFile);

                    if (imageFile != "") {
                        var productImage = req.files.image;
                        var path = 'public/product_images/' + product._id + '/' + imageFile; 

                        productImage.mv(path, (err) => {
                            return console.log(err);
                        });
                    }

                     // Sortable
                    Product.find({}).sort({sorting: 1}).exec(function(err, products) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.products = products;
                        }
                    });

                    req.flash('success', 'Product Added Successfully!');
                    res.redirect('/admin/products');
                });
            }
        });     
    }
});

// GET -- Edit Product
router.get('/edit-product/:id', (req, res) => {

    var errors;

    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    // Find Categories
    Category.find((err, categories) => {

        // Find Product
        Product.findById(req.params.id, (err, product) => {
            if (err) {
                console.log(err);
                res.redirect('/admin/products');
            } else {
                var galleryDir = 'public/product_images/' + product._id + '/gallery';
                var galleryImages = null;

                fs.readdir(galleryDir, (err, files) => {
                    if (err) { 
                        console.log(err);
                    } else {
                        galleryImages = files;

                        res.render('admin/edit_product', {
                            title: 'Product View',
                            errors: errors,
                            categories: categories,
                            category: product.category.replace(/\s+/g, '-').toLowerCase(),
                            name: product.name, 
                            shortDescription: product.shortDescription,
                            image: product.image,
                            price: parseFloat(product.price).toFixed(2),
                            sku: product.sku,
                            website: product.website,
                            facebook: product.facebook,
                            description: product.description,
                            weight: product.weight,
                            length: product.length,
                            width: product.width,
                            height: product.height,
                            countryOfManufacture: product.countryOfManufacture,
                            shippingClass: product.shippingClass,
                            HSTariffNumber: product.HSTariffNumber,
                            specialServices: product.specialServices,
                            alcoholRecipient: product.alcoholRecipient,
                            dangerousGoodsRegulation: product.dangerousGoodsRegulation,
                            dangerousGoodsAccessibility: product.dangerousGoodsAccessibility,
                            customDeclaredValue: product.customDeclaredValue,
                            freightClass: product.freightClass,
                            prePackedProduct: product.prePackedProduct,
                            nonStandardProduct: product.nonStandardProduct,
                            stockStatus: product.stockStatus,
                            galleryImages: galleryImages,
                            id: product._id,
                            messages: req.flash('success')
                        });
                    }
                });
            }
        });
    });
});

// POST -- Edit Product
router.post('/edit-product/:id', (req, res) => {
  
    var imageFile = typeof req.files.image !== 'undefined' ? req.files.image.name : '';

    // Express Validator
    req.checkBody('name', 'Name must have a value!').notEmpty();
    req.checkBody('shortDescription', 'Short Description must have a value!').notEmpty();
    req.checkBody('price', 'Price must have a value!').isDecimal();
    req.checkBody('image', 'You must upload an image!').isImage(imageFile);

    var id = req.params.id;
    var name = req.body.name;
    var slug = name.replace(/\s+/g, '-').toLowerCase();
    var sku = req.body.sku;
    var shortDescription = req.body.shortDescription;
    var description = req.body.description;
        if (description === "") {
            description = shortDescription;
        }
    var category = req.body.category;
    var price = req.body.price;
    var website = req.body.website;
    var facebook = req.body.facebook;
    var weight = req.body.weight;
    var length = req.body.length;
    var width = req.body.width;
    var height = req.body.height;
    var countryOfManufacture = req.body.countryOfManufacture;
    var shippingClass = req.body.shippingClass;
    var HSTariffNumber = req.body.HSTariffNumber;
    var specialServices = req.body.specialServices;
    var alcoholRecipient = req.body.alcoholRecipient;
    var dangerousGoodsRegulation = req.body.dangerousGoodsRegulation;
    var dangerousGoodsAccessibility = req.body.dangerousGoodsAccessibility;
    var customDeclaredValue = req.body.customDeclaredValue;
    var freightClass = req.body.freightClass;
    var prePackedProduct = req.body.prePackedProduct;
    var nonStandardProduct = req.body.nonStandardProduct;
    var stockStatus = req.body.stockStatus;


    var errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        res.redirect('/admin/products/edit-product/' + id);
    } else {
        Product.findOne({slug : slug, _id: {'$ne' : id}}, (err, product) => {
            if (err) console.log(err);

            if (product) {
                req.flash('danger', 'Product Title exists, Choose Another');
                res.redirect('/admin/products/edit-product/' + id);
            } else {
                Product.findById(id, (err, product) => {
                    if (err) console.log(err);

                    product.name = name;
                    product.slug = slug;
                    product.shortDescription = shortDescription;
                    product.description = description;
                    product.price = parseFloat(price).toFixed(2);
                    product.category = category;
                    product.sku = sku;
                    product.stockStatus = stockStatus;
                    product.website = website;
                    product.facebook = facebook;
                    product.weight = weight;
                    product.length = length;
                    product.width = width;
                    product.height = height;
                    product.shippingClass = shippingClass;
                    product.HSTariffNumber = HSTariffNumber;
                    product.countryOfManufacture = countryOfManufacture;
                    product.specialServices = specialServices;
                    product.alcoholRecipient = alcoholRecipient;
                    product.dangerousGoodsRegulation = dangerousGoodsRegulation;
                    product.dangerousGoodsAccessibility = dangerousGoodsAccessibility;
                    product.customDeclaredValue = customDeclaredValue;
                    product.freightClass = freightClass;
                    product.prePackedProduct = prePackedProduct;
                    product.nonStandardProduct = nonStandardProduct;
                    if (imageFile != "") {
                        product.image = imageFile;
                    }
                    // Save Product
                    product.save((err) => {
                        if (imageFile != "") {
                            if (pimage != "") { 
                                fs.remove('public/product_images/' + id + '/' + pimage, (err) => {
                                    if (err) console.log(err);
                                });
                            }

                            var productImage = req.files.image;
                            var path = 'public/product_images/' + id + '/' + imageFile;

                            productImage.mv(path, (err) => {
                                return console.log(err);
                            });
                        }
                        req.flash('success', 'Product Updated Successfully!');
                        res.redirect('/admin/products');
                    });
                });
            }
        });
    }
});

// GET -- Products by Category
router.get('/:category', (req, res) => {

    var categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, (err, category) => {
        if (err) console.log(err);
        Product.find((err, allProducts) => {
            Product.find({category: categorySlug}, (err, products) => {
                if (err) console.log(err);

                res.render('admin/cat_products', {
                    title: category.title,
                    products: products,
                    allProducts: allProducts
                });
            });
        });
    });
});

// POST -- Product Gallery
router.post('/product-gallery/:id', (req, res) => {

    var productImage = req.files.file;
    var id = req.params.id;
    var path = 'public/product_images/' + id + '/gallery/' + req.files.file.name;
    var thumbsPath = 'public/product_images/' + id + '/gallery/thumbs/' + req.files.file.name;

    productImage.mv(path, (err) => {
        if (err) console.log(err);

        resizeImg(fs.readFileSync(path), {width: 100, height: 100}).then((buf) => {
            fs.writeFileSync(thumbsPath, buf);
        });
    });

    res.sendStatus(200);
});

// GET -- Delete Gallery Image
router.get('/delete-image/:image', (req, res) => {

    var originalImage = 'public/product_images/' + req.query.id + '/gallery/' + req.params.image;
    var thumbImage = 'public/product_images/' + req.query.id + '/gallery/thumbs/' + req.params.image;

    fs.remove(originalImage, (err) => {
        if (err) {
            console.log(err);
        } else {
            fs.remove(thumbImage, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    req.flash('success', 'Image Deleted Successfully');
                    res.redirect('/admin/products/edit-product/' + req.query.id);
                }
            });
        }
    });
});

// GET -- Delete Product Image
router.get('/delete-product/:id', (req, res) => {

    var id = req.params.id;
    var path = 'public/product_images/' + id;

    fs.remove(path, (err) => {
        if (err) {
            console.log(err);
        } else {
            Product.findByIdAndRemove(id, (err) => {
                console.log(err);
            });

            req.flash('success', 'Product Deleted Successfully');
            res.redirect('/admin/products');
        }
    });
});

module.exports = router;


