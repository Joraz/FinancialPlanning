/// <reference path="../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var es6promise = require("es6-promise");
var mongodb = require("mongodb");
var BaseDal = require("./BaseDal");
var ObjectUtilities = require("../utilities/ObjectUtilities");
var Promise = es6promise.Promise;
/**
 * Class that provides methods to interact with the transaction MongoDB collection
 */
var TransactionDal = (function (_super) {
    __extends(TransactionDal, _super);
    function TransactionDal(dataStore, collectionName) {
        if (collectionName === void 0) { collectionName = "Transactions"; }
        _super.call(this, dataStore, collectionName);
    }
    /**
     * Get the transaction with the specified ID
     * @param transactionId
     * @returns {*}
     */
    TransactionDal.prototype.getTransaction = function (transactionId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(transactionId, true)) {
                return reject(new Error("No 'transactionId' parameter provided in TransactionDal::getTransaction()."));
            }
            _this.getDataStore().readObject(_this.getCollectionName(), { "_id": new mongodb.ObjectID(transactionId) }, {})
                .then(resolve)
                .catch(reject);
        });
    };
    /**
     * Get all transactions that belong to the specified user
     * @param userId
     * @returns {*}
     */
    TransactionDal.prototype.getTransactionsForUser = function (userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(userId, true)) {
                return reject(new Error("No 'userId' parameter provided in TransactionDal::getTransactionsForUser()."));
            }
            _this.getDataStore().readCollection(_this.getCollectionName(), { "userId": userId }, {})
                .then(function (transactions) {
                return resolve(transactions);
            })
                .catch(reject);
        });
    };
    /**
     * Create a new transaction using the data provided
     * @param transaction
     * @returns {Promise<any>}
     */
    TransactionDal.prototype.createTransaction = function (transaction) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(transaction)) {
                return reject(new Error("No 'transaction' parameter provided in TransactionDal::createTransaction()."));
            }
            _this.getDataStore().writeObject(_this.getCollectionName(), transaction)
                .then(resolve)
                .catch(reject);
        });
    };
    /**
     * Delete all transactions that belong to a specified user
     * @param userId
     * @returns {Promise<boolean>}
     */
    TransactionDal.prototype.deleteTransactionsForUser = function (userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(userId, true)) {
                return reject(new Error("No 'userId' parameter provided in TransactionDal::deleteTransactionsForUser()."));
            }
            _this.getDataStore().deleteMultipleObjects(_this.getCollectionName(), { "userId": userId })
                .then(function (response) {
                if (response) {
                    return resolve(true);
                }
                else {
                    return reject(new Error("Could not delete"));
                }
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    /**
     * Update a transaction using the specified data
     * @param transactionId
     * @param transactionData
     * @returns {*}
     */
    TransactionDal.prototype.updateTransaction = function (transactionId, transactionData) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getDataStore().updateObject(_this.getCollectionName(), { "_id": new mongodb.ObjectID(transactionId) }, transactionData)
                .then(function (response) {
                return resolve(response);
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    /**
     * Change the status of a recurring transaction to be active or not, based on its current state
     * @param transactionInstanceId
     * @returns {*}
     */
    TransactionDal.prototype.toggleRecurringTransactionInstanceStatus = function (transactionInstanceId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(transactionInstanceId, true)) {
                return reject(new Error("No 'transactionId' parameter provided in TransactionDal::toggleRecurringTransactionStatus()."));
            }
            _this.getTransaction(transactionInstanceId)
                .then(function (transaction) {
                var recurringTransaction = transaction;
                if (!recurringTransaction.startDate) {
                    return reject(new Error("Supplied transaction ID is not a recurring transaction"));
                }
                recurringTransaction.isActive = recurringTransaction.isActive !== true;
                _this.getDataStore().updateObject(_this.getCollectionName(), { "_id": new mongodb.ObjectID(transactionInstanceId) }, recurringTransaction)
                    .then(resolve)
                    .catch(reject);
            })
                .catch(reject);
        });
    };
    return TransactionDal;
})(BaseDal);
module.exports = TransactionDal;
//# sourceMappingURL=TransactionDal.js.map