const express = require('express');
const router = express.Router();

// GET Home Page 
router.get('/', (req, res) => {
	res.render('index', { 
		title: 'BluRack' 
	});
});

module.exports = router;
