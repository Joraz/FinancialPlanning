/// <reference path="../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var es6promise = require("es6-promise");
var mongodb = require("mongodb");
var _ = require("underscore");
var BaseDal = require("./BaseDal");
var CollectionUtilities = require("../utilities/CollectionUtilities");
var ObjectUtilities = require("../utilities/ObjectUtilities");
var TransactionUtilities = require("../utilities/TransactionUtilities");
var Promise = es6promise.Promise;
/**
 * Class that provides methods to interact with the transactionType MongoDB collection
 */
var TransactionTypeDal = (function (_super) {
    __extends(TransactionTypeDal, _super);
    function TransactionTypeDal(dataStore, collectionName) {
        if (collectionName === void 0) { collectionName = "TransactionTypes"; }
        _super.call(this, dataStore, collectionName);
    }
    /**
     * Create a new transaction type using the data provided
     * @param transactionType
     * @returns {*}
     */
    TransactionTypeDal.prototype.createTransactionType = function (transactionType) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(transactionType)) {
                return reject(new Error("No 'transactionType' parameter provided in TransactionTypeDal::createTransactionType()."));
            }
            _this.getDataStore().writeObject(_this.getCollectionName(), transactionType)
                .then(resolve)
                .catch(reject);
        });
    };
    /**
     * Get a transaction type by its unique ID. If it has a userId property, it must match the given userId
     * @param transactionTypeId
     * @param userId
     * @returns {*}
     */
    TransactionTypeDal.prototype.getTransactionType = function (transactionTypeId, userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(transactionTypeId, true)) {
                return reject(new Error("No 'transactionTypeId' parameter provided in TransactionTypeDal::getTransactionType()."));
            }
            return _this.getDataStore().readObject(_this.getCollectionName(), { "_id": new mongodb.ObjectID(transactionTypeId) }, {})
                .then(function (response) {
                var filtered = TransactionUtilities.filterTransactionTypesByUser(CollectionUtilities.asArray(response), userId);
                if (ObjectUtilities.isDefined(filtered, true)) {
                    return resolve(filtered[0]);
                }
                else {
                    return reject(new Error("No transaction type found"));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Get all transaction types that are default or belong to the specified user
     * @param userId
     * @returns {*}
     */
    TransactionTypeDal.prototype.getAllTransactionTypesByUserId = function (userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getDataStore().readCollection(_this.getCollectionName(), {}, {})
                .then(function (transactionTypes) {
                var filtered = TransactionUtilities.filterTransactionTypesByUser(transactionTypes, userId);
                return resolve(filtered);
            })
                .catch(reject);
        });
    };
    /**
     * Delete a given transaction type
     * @param transactionTypeId
     * @returns {any}
     */
    TransactionTypeDal.prototype.deleteTransactionType = function (transactionTypeId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(transactionTypeId, true)) {
                return reject(new Error("No 'transactionTypeId' parameter provided in TransactionTypeDal::deleteTransactionType()."));
            }
            _this.getDataStore().deleteObject(_this.getCollectionName(), { "_id": transactionTypeId })
                .then(function (response) {
                if (response) {
                    return resolve(true);
                }
                else {
                    return resolve(false);
                }
            })
                .catch(function (error) {
                if (error) {
                    return reject(error);
                }
                else {
                    return reject(new Error("Could not delete transaction type " + transactionTypeId));
                }
            });
        });
    };
    /**
     * Update a transaction type using the given parameters
     * @param transactionTypeId
     * @param name
     * @param classification
     * @param subClassification
     * @returns {*}
     */
    TransactionTypeDal.prototype.updateTransactionType = function (transactionTypeId, name, classification, subClassification) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(transactionTypeId, true)) {
                return reject(new Error("No 'transactionTypeId' parameter provided in TransactionTypeDal::updateTransactionType()."));
            }
            var updateObject = {
                $set: {}
            };
            if (ObjectUtilities.isDefined(name, true)) {
                updateObject.$set.name = name;
            }
            if (ObjectUtilities.isDefined(classification)) {
                updateObject.$set.classification = classification;
            }
            if (ObjectUtilities.isDefined(subClassification)) {
                updateObject.$set.subClassification = subClassification;
            }
            if (_.isEmpty(updateObject.$set)) {
                return reject(new Error("No updates specified in TransactionTypeDal::updateTransactionType()."));
            }
            _this.getDataStore().updateObject(_this.getCollectionName(), { "_id": new mongodb.ObjectID(transactionTypeId) }, updateObject)
                .then(resolve)
                .catch(reject);
        });
    };
    /**
     * Check whether or not a transaction type with the given ID exists in the datastore
     * @param transactionTypeId
     * @returns {*}
     */
    TransactionTypeDal.prototype.checkTransactionTypeExists = function (transactionTypeId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(transactionTypeId, true)) {
                return reject(new Error("No 'transactionTypeId' parameter provided in TransactionTypeDal::checkTransactionTypeExists()."));
            }
            _this.getDataStore().readObject(_this.getCollectionName(), { "_id": new mongodb.ObjectID(transactionTypeId) }, {})
                .then(function () {
                return resolve(true);
            })
                .catch(function () {
                return resolve(false);
            });
        });
    };
    /**
     * Delete all transaction types belonging to the specified user
     * @param userId
     * @returns {*}
     */
    TransactionTypeDal.prototype.deleteAllTransactionTypesForUser = function (userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(userId, true)) {
                return reject(new Error("No 'userId' parameter provided in TransactionTypeDal::deleteAllTransactionTypesForUser()."));
            }
            _this.getDataStore().deleteMultipleObjects(_this.getCollectionName(), { "userId": userId })
                .then(function (successful) {
                return resolve(successful);
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    return TransactionTypeDal;
})(BaseDal);
module.exports = TransactionTypeDal;
//# sourceMappingURL=TransactionTypeDal.js.map