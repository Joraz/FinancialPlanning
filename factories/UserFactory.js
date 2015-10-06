/// <reference path="../typings/tsd.d.ts" />
var es6promise = require("es6-promise");
var HashFactory = require("./HashFactory");
var ObjectUtilities = require("../utilities/ObjectUtilities");
var Promise = es6promise.Promise;
/**
 * Static class to create users
 */
var UserFactory = (function () {
    function UserFactory() {
    }
    /**
     * Create a new user using the provided parameters
     * @param username
     * @param password
     * @param balance
     * @param options
     * @returns {*}
     */
    UserFactory.createUser = function (username, password, balance, options) {
        return new Promise(function (resolve, reject) {
            if (!ObjectUtilities.isDefined(username, true)) {
                return reject(new Error("No 'username' parameter provided in UserFactory::createUser()."));
            }
            if (!ObjectUtilities.isDefined(password, true)) {
                return reject(new Error("No 'password' parameter provided in UserFactory::createUser()."));
            }
            HashFactory.createHash(password)
                .then(function (passwordHash) {
                var user = {
                    _id: username,
                    hash: passwordHash.hash,
                    salt: passwordHash.salt,
                    balance: ObjectUtilities.isDefined(balance) ? parseFloat(balance.toFixed(2)) : 0,
                    options: {}
                };
                if (ObjectUtilities.isDefined(options) &&
                    (ObjectUtilities.isDefined(options.lowLimitWarning) || (ObjectUtilities.isDefined(options.preferredName)))) {
                    user.options = options;
                }
                return resolve(user);
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    return UserFactory;
})();
module.exports = UserFactory;
//# sourceMappingURL=UserFactory.js.map