/// <reference path="../typings/tsd.d.ts" />
var es6promise = require("es6-promise");
var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var Promise = es6promise.Promise;
/**
 * A class to control interactions with the mongodb client. Provides CRUD methods which return es6 promises
 */
var Database = (function () {
    function Database(databaseName) {
        var serverName = "localhost";
        var port = 27017;
        databaseName = databaseName || "financial-planning";
        this._connectionString = "mongodb://" + serverName + ":" + port + "/" + databaseName;
    }
    /**
     * Read a document from the specified collection using the match provided
     * @param collectionName
     * @param match
     * @param fields
     * @returns {*}
     */
    Database.prototype.readObject = function (collectionName, match, fields) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getCollection(collectionName)
                .then(function (collection) {
                collection.findOne(match, fields, function (error, result) {
                    if (error) {
                        return reject(error);
                    }
                    if (!result) {
                        return reject(new Error("No item found using match: " + JSON.stringify(match)));
                    }
                    return resolve(result);
                });
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    /**
     * Read the entire collection and return all documents that match the given match
     * @param collectionName
     * @param match
     * @param fields
     * @returns {*}
     */
    Database.prototype.readCollection = function (collectionName, match, fields) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getCollection(collectionName)
                .then(function (collection) {
                collection.find(match, fields)
                    .toArray(function (error, results) {
                    if (error) {
                        return reject(error);
                    }
                    if (!results) {
                        return reject(new Error("No items found using match: ") + JSON.stringify(match));
                    }
                    return resolve(results);
                });
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    /**
     * Write a document to the specified collection
     * @param collectionName
     * @param data
     * @returns {*}
     */
    Database.prototype.writeObject = function (collectionName, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getCollection(collectionName)
                .then(function (collection) {
                collection.insertOne(data, function (error, result) {
                    if (error) {
                        return reject(error);
                    }
                    var insertionResult = result.result;
                    var ops = result.ops;
                    //check the result count
                    if (insertionResult && insertionResult.n && insertionResult.n > 0) {
                        // ops stores the documents that were inserted
                        return resolve(ops[0]);
                    }
                    else {
                        return reject(new Error("Could not insert item"));
                    }
                });
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    /**
     * Write multiple objects to the specified collection
     * @param collectionName
     * @param data
     * @returns {*}
     */
    Database.prototype.writeMultipleObjects = function (collectionName, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getCollection(collectionName)
                .then(function (collection) {
                collection.insertMany(data, function (error, result) {
                    if (error) {
                        return reject(error);
                    }
                    var insertionResult = result.result;
                    var ops = result.ops;
                    //check the result
                    if (insertionResult && insertionResult.n && insertionResult.n > 0) {
                        return resolve(ops);
                    }
                    else {
                        return reject(new Error("Could not insert items"));
                    }
                });
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    /**
     * Update a document in the specified collection using the match provided
     * @param collectionName
     * @param match
     * @param data
     * @returns {*}
     */
    Database.prototype.updateObject = function (collectionName, match, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getCollection(collectionName)
                .then(function (collection) {
                collection.findOneAndUpdate(match, data, { returnOriginal: false }, function (error, result) {
                    if (error) {
                        return reject(error);
                    }
                    if (!result.value) {
                        return reject(new Error("No item found using match: " + JSON.stringify(match)));
                    }
                    return resolve(result.value);
                });
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    /**
     * Delete a document in the specified collection that matches the given match
     * @param collectionName
     * @param match
     * @returns {*}
     */
    Database.prototype.deleteObject = function (collectionName, match) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getCollection(collectionName)
                .then(function (collection) {
                collection.deleteOne(match, function (error, result) {
                    if (error) {
                        return reject(error);
                    }
                    var result = result.result;
                    //check the result
                    if (result && result.n && result.n > 0) {
                        return resolve(true);
                    }
                    else {
                        return reject();
                    }
                });
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    /**
     * Delete any documents that match the given match
     * @param collectionName
     * @param match
     * @returns {*}
     */
    Database.prototype.deleteMultipleObjects = function (collectionName, match) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getCollection(collectionName)
                .then(function (collection) {
                collection.deleteMany(match, function (error, result) {
                    if (error) {
                        return reject(error);
                    }
                    var result = result.result;
                    //check the result
                    if (result && result.n && result.n > 0) {
                        return resolve(true);
                    }
                    else {
                        return reject();
                    }
                });
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    /**
     * Delete the specified collection
     * @param collectionName
     * @returns {*}
     */
    Database.prototype.deleteCollection = function (collectionName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getDb()
                .then(function (db) {
                db.dropCollection(collectionName, function (error, result) {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result);
                });
            });
        });
    };
    /**
     * Close the MongoDB instance
     */
    Database.prototype.close = function () {
        if (this._db) {
            this._db.close();
        }
    };
    /**
     * Return the MongoDb instance
     * @returns {mongodb.Db}
     */
    Database.prototype.getDb = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._db) {
                return resolve(_this._db);
            }
            else {
                mongoClient.connect(_this._connectionString, function (err, db) {
                    if (err) {
                        return reject(err);
                    }
                    _this._db = db;
                    return resolve(db);
                });
            }
        });
    };
    /**
     * Return the specified MongoDB collection
     * @param collectionName
     * @returns {mongodb.Collection}
     */
    Database.prototype.getCollection = function (collectionName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getDb()
                .then(function (db) {
                db.collection(collectionName, function (err, collection) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(collection);
                });
            });
        });
    };
    return Database;
})();
module.exports = Database;
//# sourceMappingURL=Database.js.map