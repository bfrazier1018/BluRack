const express = require('express');
const router = express.Router();


// Admin Routes
router.get('/', (req, res) => {
 	res.send('Admin Routes');
});

module.exports = router;