var express = require('express');
var router = express.Router();

// Get Order Model
var Order = require('../models/order.js');

// ----------------------- /admin/orders -------------------

// GET -- All Orders
router.get('/', (req, res) => {
    
    Order.find((err, orders) => {
        if (err) console.log(err);

        res.render('admin/orders', {
            title: 'Admin | Orders',
            orders: orders,
            messages: req.flash('success')
        });
    });
});

// GET -- Add Category
router.get('/add-category', (req, res) => {
 
    var name = "";

    res.render('admin/add_category', {
        title: 'Add Category',
        name: name,
        messages: []
    });
});

// POST -- Add Category
router.post('/add-category', (req, res) => {
  
    // Express Validator
    req.checkBody('name', 'Name must have a value').notEmpty();

    var name = req.body.name;
    var slug = name.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            name: name,
            slug: slug,
            title: 'Add Category',
            messages: []
        });

    } else {

        // Check if Name Already Exists
        Category.findOne({ slug: slug }, (err, category) => {
            if (category) {
                req.flash('danger', 'Category Name Exists, Choose Another');
                res.render('admin/add_category', {
                    name: name,
                    title: 'Add Category',
                    messages: req.flash('danger')
                });
            } else {
                var category = new Category({
                    name: name,
                    slug: slug,
                    sorting: 100
                });
                // Save Category
                category.save(function(err) {
                    if (err) console.log(err);

                    Category.find({}).sort({sorting: 1}).exec((err, categories) => {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.categories = categories;
                        }
                    });

                    req.flash('success', 'Category Added Successfully!');
                    res.redirect('/admin/categories');
                });
            }
        });     
    }
});

// GET -- Edit Category
router.get('/edit-category/:id', (req, res) => {
  
    // Find One Category by Slug 
    Category.findById(req.params.id, (err, category) => {
        if (err) console.log(err);

        res.render('admin/edit_category', {
            title: 'Edit Category',
            name: category.name, 
            id: category._id,
            messages: []
        });
    });
});

// POST -- Edit Category
router.post('/edit-category/:id', (req, res) => {
  
    // Express Validator
    req.checkBody('name', 'Name must have a value').notEmpty();

    var name = req.body.name;
    var slug = name.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_category', {
            title: 'Edit Category',
            errors: errors,
            name: name,
            id: id,
            messages: []
        }); 
    } else {
        // Check if Name Already Exists
        Category.findOne({ slug: slug, _id:{'$ne':id} }, (err, category) => {
            if (category) {
                req.flash('danger', 'Category Name Exists, Choose Another');
                res.render('admin/edit_category', {
                    title: 'Edit Category',
                    name: name,
                    id: id,
                    messages: req.flash('danger')
                });
            } else {
                // Find Category By Id
                Category.findById(id, (err, category) => {
                    if (err) console.log(err);

                    category.name = name;
                    category.slug = slug;

                    // Save Category
                    category.save(function(err) {
                        if (err) console.log(err);

                        Category.find({}).sort({sorting: 1}).exec((err, categories) => {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        });
                        req.flash('success', 'Category Updated Successfully!');
                        res.redirect('/admin/categories');
                    });
                });
            }
        });   
    }
});

// GET -- Delete Category
router.get('/delete-category/:id', (req, res) => {

    Category.findByIdAndRemove(req.params.id, (err) => {
        if (err) return console.log(err);

        Category.find({}).sort({sorting: 1}).exec((err, categories) => {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.categories = categories;
            }
        });

        req.flash('success', 'Category Deleted Successfully!');
        res.redirect('/admin/categories');
    });
});

module.exports = router;

