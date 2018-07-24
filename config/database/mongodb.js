const { MongoClient } = require('mongodb');

// MongoDb Database Config
const config = 'mongodb://localhost:27017';

// Create Database
const dbName = 'BluRack';

(async function mongo(){
	let client; 
	try {
		client = await MongoClient.connect(config); 
		console.log('------------- Connected to MongoDB ----------------');
		const db = client.db(dbName);
	} catch (err) {

	}
}());

module.exports = {
	MongoClient
}