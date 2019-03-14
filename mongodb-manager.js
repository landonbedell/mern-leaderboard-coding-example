(() => {
	'use strict'
	const MongoDB = require('mongodb');
	const MongoClient = MongoDB.MongoClient;
	const ObjectId = MongoDB.ObjectId;

	const mongoUrl = "mongodb://localhost:27017/"

	class MongodbManager {
		constructor(dbName, collectionName) {
			this._dbName = dbName;
			this._collectionName = collectionName;
		}

		_connect(dbName) {
			return Promise.resolve()
			.then(() => MongoClient.connect(mongoUrl))
			.catch((err) => Promise.reject(new Error(err)));
		}

		_getCollection(dbName, collection) {
			return Promise.resolve()
			.then(() => this._connect(dbName))
			.then((client) => client.db(dbName))
			.then((db) => db.collection(collection));
		}

		_connectAndExecute(dbName, collection, cb) {
			return Promise.resolve()
			.then(() => {
				return MongoClient.connect((mongoUrl), (err, db) =>{
					if (err) throw err;
					const dbo = db.db(dbName);
					cb(dbo.collection(collecton))
				});
			})
		}

		create(item) {
			return this._getCollection(this._dbName, this._collectionName)
			.then((collection) => collection.insertOne(item))
			.then((res) => res.ops[0]);
		}

		update(item) {
			return this._getCollection(this._dbName, this._collectionName)
			.then((collection) => {
				const {_id, ...update} = item;
				console.log('updating!!!', _id, update);
				return collection.findOneAndUpdate({_id: new ObjectId(_id)}, {$set: update}, {returnOriginal: false});
			})
			.then((res) => res.value);
		}

		list(query = {}, options = {}) {
			return this._getCollection(this._dbName, this._collectionName)
			.then((collection) => collection.find(query).toArray());
		}
	}

	module.exports = MongodbManager
})();