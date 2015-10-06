/// <reference path="../typings/tsd.d.ts" />
var express = require("express");
var passport = require("passport");
var HashFactory = require("../factories/HashFactory");
var ObjectUtilities = require("../utilities/ObjectUtilities");
var TokenFactory = require("../factories/TokenFactory");
var TransactionDal = require("../database/TransactionDal");
var TransactionTypeDal = require("../database/TransactionTypeDal");
var TransactionUtilities = require("../utilities/TransactionUtilities");
var UserDal = require("../database/UserDal");
var UserFactory = require("../factories/UserFactory");
var router = express.Router();
// Contains route definitions for users
/**
 * GET status of JSONWebToken
 */
router.get('/status', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    //if execution arrives here, then the token has been validated. We can just return an OK response to the client
    return httpResponse.status(200 /* ok */).send({});
});
/**
 * GET user summary information
 */
router.get('/summary', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var user = httpRequest.user;
    var userSummary = {
        name: user.options && user.options.preferredName ? user.options.preferredName : user._id,
        balance: user.balance
    };
    if (user.options && !isNaN(user.options.lowLimitWarning)) {
        userSummary.limitWarning = user.options.lowLimitWarning;
    }
    return httpResponse.status(200 /* ok */).send(userSummary);
});
/**
 * GET user details
 */
router.get('/details', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var user = httpRequest.user;
    var userDetails = {
        preferredName: user.options.preferredName || "",
        lowLimitWarning: user.options.lowLimitWarning
    };
    return httpResponse.status(200 /* ok */).send(userDetails);
});
/**
 * GET balance summary
 */
router.get('/summary/balance', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var user = httpRequest.user;
    var db = httpRequest.database;
    var transactionDal = new TransactionDal(db);
    var start = httpRequest.query.startDate;
    if (!ObjectUtilities.isDefined(start, true)) {
        return httpResponse.status(400 /* badRequest */).send("No start date provided");
    }
    var end = httpRequest.query.endDate;
    if (!ObjectUtilities.isDefined(end, true)) {
        return httpResponse.status(400 /* badRequest */).send("No end date provided");
    }
    var balance = user.balance;
    var userId = user._id;
    transactionDal.getTransactionsForUser(userId)
        .then(function (transactions) {
        var summaries = TransactionUtilities.createBalanceSummary(transactions, new Date(start), new Date(end), balance);
        return httpResponse.status(200 /* ok */).send(summaries);
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * GET forecast summary
 */
router.get('/forecast', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var currentBalance = httpRequest.user.balance;
    var userId = httpRequest.user._id;
    var db = httpRequest.database;
    var transactionDal = new TransactionDal(db);
    transactionDal.getTransactionsForUser(userId)
        .then(function (transactions) {
        var filtered = transactions.filter(function (x) { return x.hasOwnProperty('isActive'); });
        var summaries = TransactionUtilities.createBalanceForecast(filtered, currentBalance);
        return httpResponse.status(200 /* ok */).send(summaries);
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * POST a new user
 */
router.post('/', function (httpRequest, httpResponse) {
    var username = httpRequest.body.username;
    var password = httpRequest.body.password;
    var balance = httpRequest.body.balance;
    var preferredName = httpRequest.body.preferredName;
    var lowLimitWarning = httpRequest.body.lowLimitWarning;
    var userDal = new UserDal(httpRequest.database);
    if (!ObjectUtilities.isDefined(username, true)) {
        return httpResponse.status(400 /* badRequest */).send("No Username provided");
    }
    if (!ObjectUtilities.isDefined(password, true)) {
        return httpResponse.status(400 /* badRequest */).send("No Password provided");
    }
    var userOptions;
    if (ObjectUtilities.isDefined(preferredName, true)) {
        if (!ObjectUtilities.isDefined(userOptions)) {
            userOptions = {};
        }
        userOptions.preferredName = preferredName;
    }
    if (ObjectUtilities.isDefined(lowLimitWarning)) {
        if (!ObjectUtilities.isDefined(userOptions)) {
            userOptions = {};
        }
        userOptions.lowLimitWarning = lowLimitWarning;
    }
    UserFactory.createUser(username, password, balance, userOptions)
        .then(function (user) {
        return userDal.createUser(user);
    })
        .then(function (response) {
        var jwt = TokenFactory.generateJWT(response._id);
        return httpResponse.status(200 /* ok */).send(jwt);
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message);
    });
});
/**
 * POST a login request
 */
router.post('/login', passport.authenticate('local', { session: false }), function (httpRequest, httpResponse) {
    var jwt = TokenFactory.generateJWT(httpRequest.user._id);
    return httpResponse.status(200 /* ok */).send(jwt);
});
/**
 * POST a password update request
 */
router.post('/updatePassword', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var password = httpRequest.body.password;
    if (!password) {
        return httpResponse.status(400 /* badRequest */).send("No Password provided");
    }
    HashFactory.createHash(password)
        .then(function (hashResponse) {
        var database = httpRequest.database;
        var userDal = new UserDal(database);
        var userId = httpRequest.user._id;
        userDal.updatePassword(userId, { hash: hashResponse.hash, salt: hashResponse.salt })
            .then(function (user) {
            var jwt = TokenFactory.generateJWT(user._id);
            return httpResponse.status(200 /* ok */).send(jwt);
        });
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * PUT an existing user
 */
router.put('/', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var database = httpRequest.database;
    var userId = httpRequest.user._id;
    var updatedPreferredName = httpRequest.body.preferredName;
    var updatedLowLimitWarning = httpRequest.body.lowLimitWarning;
    var updatedPassword = httpRequest.body.password;
    var userDal = new UserDal(database);
    var promises = [];
    if (updatedPreferredName) {
        promises.push(userDal.updatePreferredName(userId, updatedPreferredName));
    }
    if (!isNaN(updatedLowLimitWarning)) {
        promises.push(userDal.updateLimitWarning(userId, updatedLowLimitWarning));
    }
    if (updatedPassword) {
        HashFactory.createHash(updatedPassword)
            .then(function (hash) {
            promises.push(userDal.updatePassword(userId, hash));
        });
    }
    Promise.all(promises)
        .then(function () {
        return httpResponse.status(200 /* ok */).send({});
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * DELETE user
 */
router.delete('/', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var database = httpRequest.database;
    var userDal = new UserDal(database);
    var transactionDal = new TransactionDal(database);
    var transactionTypeDal = new TransactionTypeDal(database);
    var userId = httpRequest.user._id;
    var promises = [];
    promises.push(userDal.deleteUser(userId));
    promises.push(transactionDal.deleteTransactionsForUser(userId));
    promises.push(transactionTypeDal.deleteAllTransactionTypesForUser(userId));
    Promise.all(promises)
        .then(function () {
        return httpResponse.status(200 /* ok */).send({});
    })
        .catch(function (error) {
        console.log(JSON.stringify(error, null, 2));
        return httpResponse.status(500 /* internalServerError */).send(error);
    });
});
module.exports = router;
//# sourceMappingURL=users.js.map