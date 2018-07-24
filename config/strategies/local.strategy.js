const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');

module.exports = function localStrategy() {

	passport.use(new Strategy({
			usernameField: 'email', 
			passwordField: 'password'
		}, (username, password, done) => {
			
			// Mongo DB Config
			const url = 'mongodb://localhost:27017';
			const dbName = 'BluRack';
			
			(async function logIn(){
				let client;
				try {
					// Connect to MongoDB
					client = await MongoClient.connect(url, { useNewUrlParser: true });
					console.log('--- Connected to MongoDB ---');
					
					const db = client.db(dbName);
					const col = db.collection('users');

					// Find One User by Email 
					const user = await col.findOne({ email: username });

					// Check Password
					if (user.password === password) {
						done(null, user);
					} else {
						done(null, false);
					}

				} catch (err) {
					console.log(err);
				}
				// Close Mongo Connection
				client.close();
			}());
		}));
};