const express = require('express');
const router = express.Router();
const passport = require('passport');
const { MongoClient } = require('mongodb');

// Home Page
router.get('/', (req, res) => {
  res.render('index', { title: 'BluRack' });
});

// Sign Up Page -- GET
router.get('/signup', (req, res) => {
	res.render('signup', {
		title: 'BluRack | Sign Up'
	});
});

// Sign Up -- POST
router.post('/signup', (req, res) => {

	const { email, password } = req.body;
	const url = 'mongodb://localhost:27017';
	const dbName = 'BluRack';

	(async function addUser(){
		let client;
		try {
			client = await MongoClient.connect(url, { useNewUrlParser: true });
			console.log('----- Connected to MongoDB -------');

			const db = client.db(dbName);
			const col = db.collection('users');

			const user = { email, password };
			const results = await col.insertOne(user);

			req.login(results.ops[0], () => {
			res.redirect('/profile');
			});
		} catch (err) {
			console.log(err);
		}
		// Close MongoDb Connection
		client.close();
	}());
});

// Log In Page -- GET
router.get('/login', (req, res) => {
	res.render('login', {
		title: 'BluRack | Log In'
	});
});

// Log In Authentication -- POST
router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	failureRedirect: '/login'
}));

// Log Out 
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});

// User Profile Page
router.get('/profile', (req, res) => {
	// Check if User is Signed In
	// Also able to do (req.user.isAdmin)...
	if (req.user) {
		res.json(req.user);
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
