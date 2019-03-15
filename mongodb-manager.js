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
		}

		_connect(url) {
			return Promise.resolve()
			.then(() => MongoClient.connect(url, {useNewUrlParser: true}))
			.catch((err) => Promise.reject(new Error(err)));
		}

		create(item, dbName=this._dbName, collectionName=this._collectionName) {
			return this._connect(MONGO_URL)
			.then((client) => {
				return Promise.resolve()
				.then(() => client.db(dbName))
				.then((db) => db.collection(collectionName))
				.then((collection) => collection.insertOne(item))
				.then(() => client.close());
			});
		}
		
		delete(id, dbName=this._dbName, collectionName=this._collectionName) {
			return this._connect(MONGO_URL)
			.then((client) => {
				return Promise.resolve()
				.then(() => client.db(dbName))
				.then((db) => db.collection(collectionName))
				.then((collection) => collection.findOneAndDelete({_id: new ObjectId(id)}, {returnOriginal: false}))
				.then(() => client.close());
			});
		}

		update(item, dbName=this._dbName, collectionName=this._collectionName) {
			return this._connect(MONGO_URL)
			.then((client) => {
				return Promise.resolve()
				.then(() => client.db(dbName))
				.then((db) => db.collection(collectionName))
				.then((collection) => {
					const {_id, ...update} = item;
					return collection.findOneAndUpdate({_id: new ObjectId(_id)}, {$set: update}, {returnOriginal: false});
				})
				.then(() => client.close());
			});
		}

		list(query = {}, dbName=this._dbName, collectionName=this._collectionName) {
			return this._connect(MONGO_URL)
			.then((client) => {
				return Promise.resolve()
				.then(() => client.db(dbName))
				.then((db) => db.collection(collectionName))
				.then((collection) => collection.find(query).toArray())
				.then((res) => {
					return client.close()
					.then(() => res);
				});
			});
		}
	}

	module.exports = MongodbManager
})();