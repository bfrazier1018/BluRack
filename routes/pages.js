const express = require('express');
const router = express.Router();

// GET -- Home Page 
router.get('/', (req, res) => {
	res.render('index', { 
		title: 'BluRack' 
	});
});

// GET -- Services Page
router.get('/services', (req, res) => {
	res.render('services', {
		title: 'Services'
	});
});

// GET -- Contact Page
router.get('/contact-us', (req, res) => {
	res.render('contact_us', {
		title: 'Contact Us'
	});
});

module.exports = router;
