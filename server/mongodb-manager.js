(() => {
	'use strict'
	const MongoDB = require('mongodb');
	const MongoClient = MongoDB.MongoClient;
	const ObjectId = MongoDB.ObjectId;

	const MONGO_URL = "mongodb://localhost:27017/";

	class MongodbManager {
		constructor(dbName, collectionName) {
			this._dbName = dbName;
			this._collectionName = collectionName;
			this._client = null;
		}

		_connect(url) {
			return Promise.resolve()
			.then(() => MongoClient.connect(url, {useNewUrlParser: true}))
			.catch((err) => Promise.reject(new Error(err)));
		}

		_getClient(url) {
			if (this._client === null) {
				this._client = this._connect(url);
			}
			return this._client;
		}

		create(item, dbName=this._dbName, collectionName=this._collectionName) {
			return Promise.resolve()
			.then(() => this._getClient(MONGO_URL))
			.then((client) => client.db(dbName))
			.then((db) => db.collection(collectionName))
			.then((collection) => collection.insertOne(item));
		}
		
		delete(id, dbName=this._dbName, collectionName=this._collectionName) {
			return Promise.resolve()
			.then(() => this._getClient(MONGO_URL))
			.then((client) => client.db(dbName))
			.then((db) => db.collection(collectionName))
			.then((collection) => collection.findOneAndDelete({_id: new ObjectId(id)}, {returnOriginal: false}));
		}

		update(item, dbName=this._dbName, collectionName=this._collectionName) {
			return Promise.resolve()
			.then(() => this._getClient(MONGO_URL))
			.then((client) => client.db(dbName))
			.then((db) => db.collection(collectionName))
			.then((collection) => {
				const {_id, ...update} = item;
				return collection.findOneAndUpdate({_id: new ObjectId(_id)}, {$set: update}, {returnOriginal: false});
			});
		}

		list(query = {}, dbName=this._dbName, collectionName=this._collectionName) {
			return Promise.resolve()
			.then(() => this._getClient(MONGO_URL))
			.then((client) => client.db(dbName))
			.then((db) => db.collection(collectionName))
			.then((collection) => collection.find(query).toArray());
		}
	}

	module.exports = MongodbManager
})();