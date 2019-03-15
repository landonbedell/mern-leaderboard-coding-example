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

		_connect(dbName) {
			return Promise.resolve()
			.then(() => MongoClient.connect(MONGO_URL, {useNewUrlParser: true}))
			.catch((err) => Promise.reject(new Error(err)));
		}

		_getCollection(dbName, collection) {
			return Promise.resolve()
			.then(() => this._connect(dbName))
			.then((client) => client.db(dbName))
			.then((db) => db.collection(collection));
		}

		create(item, dbName=this._dbName, collectionName=this._collectionName) {
			return this._getCollection(dbName, collectionName)
			.then((collection) => collection.insertOne(item))
			.then((res) => res.ops[0]);
		}
		
		delete(id, dbName=this._dbName, collectionName=this._collectionName) {
			return this._getCollection(dbName, collectionName)
			.then((collection) => collection.findOneAndDelete({_id: new ObjectId(id)}, {returnOriginal: false}))
			.then((res) => res.value);
		}

		update(item, dbName=this._dbName, collectionName=this._collectionName) {
			return this._getCollection(dbName, collectionName)
			.then((collection) => {
				const {_id, ...update} = item;
				return collection.findOneAndUpdate({_id: new ObjectId(_id)}, {$set: update}, {returnOriginal: false});
			})
			.then((res) => res.value);
		}

		list(query = {}, dbName=this._dbName, collectionName=this._collectionName) {
			return this._getCollection(dbName, collectionName)
			.then((collection) => collection.find(query).toArray());
		}
	}

	module.exports = MongodbManager
})();