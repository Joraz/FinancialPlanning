/// <reference path="../typings/tsd.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var es6promise = require("es6-promise");
var BaseDal = require("./baseDal");
var ObjectUtilities = require("../utilities/ObjectUtilities");
var Promise = es6promise.Promise;
/**
 * Class that provides methods to interact with the users MongoDB collection
 */
var UserDal = (function (_super) {
    __extends(UserDal, _super);
    function UserDal(dataStore, collectionName) {
        if (collectionName === void 0) { collectionName = "Users"; }
        _super.call(this, dataStore, collectionName);
    }
    /**
     * Get the specified user
     * @param userId
     * @returns {*}
     */
    UserDal.prototype.getUser = function (userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(userId, true)) {
                return reject(new Error("No 'userId' parameter provided in UserDal::getUser()."));
            }
            _this.getDataStore().readObject(_this.getCollectionName(), { "_id": userId }, {})
                .then(resolve)
                .catch(reject);
        });
    };
    /**
     * Create a new user with the provided data
     * @param user
     * @returns {*}
     */
    UserDal.prototype.createUser = function (user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(user)) {
                return reject(new Error("No 'user' parameter provided in UserDal::createUser()."));
            }
            _this.getDataStore().writeObject(_this.getCollectionName(), user)
                .then(resolve)
                .catch(function (error) {
                // duplicate error
                if (error && error.code && error.code === 11000) {
                    return reject(new Error("Could not create user " + user._id + " because it already exists."));
                }
                else {
                    return reject(new Error("Error creating new user"));
                }
            });
        });
    };
    /**
     * Delete a user with the specified ID
     * @param userId
     * @returns {*}
     */
    UserDal.prototype.deleteUser = function (userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(userId, true)) {
                return reject(new Error("No 'userId' parameter provided in UserDal::deleteUser()."));
            }
            _this.getDataStore().deleteObject(_this.getCollectionName(), { "_id": userId })
                .then(function (response) {
                if (response) {
                    return resolve(true);
                }
                else {
                    return reject(false);
                }
            })
                .catch(function (error) {
                if (error) {
                    return reject(error);
                }
                else {
                    return reject(new Error("Could not delete user " + userId));
                }
            });
        });
    };
    /**
     * Update the password hash for a user
     * @param userId
     * @param hash
     * @returns {*}
     */
    UserDal.prototype.updatePassword = function (userId, hash) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(userId, true)) {
                return reject(new Error("No 'userId' parameter provided in UserDal::updatePassword()."));
            }
            if (!ObjectUtilities.isDefined(hash)) {
                return reject(new Error("No 'hash' parameter provided in UserDal::updatePassword()."));
            }
            var updateObject = {
                $set: {
                    hash: hash.hash,
                    salt: hash.salt
                }
            };
            _this.getDataStore().updateObject(_this.getCollectionName(), { "_id": userId }, updateObject)
                .then(resolve)
                .catch(reject);
        });
    };
    /**
     * Update the preferred name for a user
     * @param userId
     * @param preferredName
     * @returns {Promise<any>}
     */
    UserDal.prototype.updatePreferredName = function (userId, preferredName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(userId, true)) {
                return reject(new Error("No 'userId' parameter provided in UserDal::updatePreferredName()."));
            }
            if (!ObjectUtilities.isDefined(preferredName, true)) {
                return reject(new Error("No 'preferredName' parameter provided in UserDal::updatePreferredName()."));
            }
            var updateObject = {
                $set: {
                    "options.preferredName": preferredName
                }
            };
            _this.getDataStore().updateObject(_this.getCollectionName(), { "_id": userId }, updateObject)
                .then(resolve)
                .catch(reject);
        });
    };
    /**
     * Update the limit warning for a user
     * @param userId
     * @param limitWarning
     * @returns {Promise<any>}
     */
    UserDal.prototype.updateLimitWarning = function (userId, limitWarning) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(userId, true)) {
                return reject(new Error("No 'userId' parameter provided in UserDal::updateLimitWarning()."));
            }
            if (!ObjectUtilities.isDefined(limitWarning)) {
                return reject(new Error("No 'limitWarning' parameter provided in UserDal::updateLimitWarning()."));
            }
            var updateObject = {
                $set: {
                    "options.lowLimitWarning": limitWarning
                }
            };
            _this.getDataStore().updateObject(_this.getCollectionName(), { "_id": userId }, updateObject)
                .then(resolve)
                .catch(reject);
        });
    };
    /**
     * Update the balance for a user
     * @param userId
     * @param balance
     * @returns {*}
     */
    UserDal.prototype.updateBalance = function (userId, balance) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(userId, true)) {
                return reject(new Error("No 'userId' parameter provided in UserDal::updateBalance()."));
            }
            if (!ObjectUtilities.isDefined(balance)) {
                return reject(new Error("No 'balance' parameter provided in UserDal::updateBalance()."));
            }
            var updateObject = {
                $set: {
                    "balance": balance
                }
            };
            _this.getDataStore().updateObject(_this.getCollectionName(), { "_id": userId }, updateObject)
                .then(resolve)
                .catch(reject);
        });
    };
    return UserDal;
})(BaseDal);
module.exports = UserDal;
//# sourceMappingURL=UserDal.js.map