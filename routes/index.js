const express = require('express');
const router = express.Router();

// GET -- Home Page 
router.get('/', (req, res) => {
	res.render('index', { 
		title: 'BluRack | Spirits Company' 
	});
});

// GET -- Services Page
// router.get('/services', (req, res) => {
// 	res.render('services', {
// 		title: 'BluRack | Services'
// 	});
// });

// GET -- Contact Page
router.get('/contact-us', (req, res) => {
	res.render('contact', {
		title: 'BluRack | Contact Us'
	});
});

module.exports = router;
