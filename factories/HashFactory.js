/// <reference path="../typings/tsd.d.ts" />
var bcrypt = require("bcrypt-nodejs");
var es6promise = require("es6-promise");
var ObjectUtilities = require("../utilities/ObjectUtilities");
var Promise = es6promise.Promise;
/**
 * Contains functions relating to creating and checking password hashes
 */
var HashFactory = (function () {
    function HashFactory() {
    }
    /**
     * Given a string, create a hash and salt and return them
     * @param password
     * @returns {*}
     */
    HashFactory.createHash = function (password) {
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(password, true)) {
                return reject(new Error("No 'password' parameter provided in HashFactory::createHash()."));
            }
            bcrypt.genSalt(10, function (error, salt) {
                if (error) {
                    return reject(error);
                }
                bcrypt.hash(password, salt, null, function (error, hash) {
                    if (error) {
                        return reject(error);
                    }
                    else {
                        var pwHash = {
                            hash: hash,
                            salt: salt
                        };
                        return resolve(pwHash);
                    }
                });
            });
        });
    };
    /**
     * Given a password and a hash, check if the password is valid
     * @param providedPassword
     * @param dbHash
     * @returns {*}
     */
    HashFactory.checkHash = function (providedPassword, dbHash) {
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(providedPassword, true)) {
                return reject(new Error("No 'providedPassword' parameter provided in HashFactory::checkHash()."));
            }
            if (!ObjectUtilities.isDefined(dbHash, true)) {
                return reject(new Error("No 'dbHash' parameter provided in HashFactory::checkHash()."));
            }
            bcrypt.compare(providedPassword, dbHash, function (error, match) {
                if (error) {
                    return reject(error);
                }
                else {
                    return resolve(match);
                }
            });
        });
    };
    return HashFactory;
})();
module.exports = HashFactory;
//# sourceMappingURL=HashFactory.js.map