/// <reference path="../typings/tsd.d.ts" />

import express = require("express");
import passport = require("passport");

import HashFactory = require("../factories/HashFactory");
import HttpCodes = require("../enums/HttpCodes");
import ObjectUtilities = require("../utilities/ObjectUtilities");
import TokenFactory = require("../factories/TokenFactory");
import TransactionDal = require("../database/TransactionDal");
import TransactionUtilities = require("../utilities/TransactionUtilities");
import UserDal = require("../database/UserDal");
import UserFactory = require("../factories/UserFactory");

var router: express.Router = express.Router();

/**
 * Create a new user. Will return a jsonwebtoken
 */
router.post('/', (httpRequest: express.Request, httpResponse: express.Response) =>
{
    var username = httpRequest.body.username;
    var password = httpRequest.body.password;
    var balance = httpRequest.body.balance;
    var preferredName = httpRequest.body.preferredName;
    var lowLimitWarning = httpRequest.body.lowLimitWarning;
    var userDal = new UserDal(httpRequest.database);

    if (!ObjectUtilities.isDefined(username, true))
    {
        return httpResponse.status(HttpCodes.badRequest).send("No Username provided");
    }

    if (!ObjectUtilities.isDefined(password, true))
    {
        return httpResponse.status(HttpCodes.badRequest).send("No Password provided");
    }

    var userOptions: FinancialPlanning.Server.Users.IUserOptions;
    if (ObjectUtilities.isDefined(preferredName, true))
    {
        if (!ObjectUtilities.isDefined(userOptions))
        {
            userOptions = {};
        }

        userOptions.preferredName = preferredName;
    }

    if (ObjectUtilities.isDefined(lowLimitWarning))
    {
        if (!ObjectUtilities.isDefined(userOptions))
        {
            userOptions = {};
        }

        userOptions.lowLimitWarning = lowLimitWarning;
    }

    UserFactory.createUser(username, password, balance, userOptions)
        .then((user: FinancialPlanning.Server.Users.IUser) =>
        {
            return userDal.createUser(user);

        })
        .then((response: FinancialPlanning.Server.Users.IUser) =>
        {
            var jwt: string = TokenFactory.generateJWT(response._id);
            return httpResponse.status(HttpCodes.ok).send(jwt);
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message);
        });
});

router.put('/', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    let database = httpRequest.database;
    let userId = httpRequest.user._id;
    let updatedPreferredName = httpRequest.body.preferredName;
    let updatedLowLimitWarning = httpRequest.body.lowLimitWarning;
    let updatedPassword = httpRequest.body.password;
    let userDal = new UserDal(database);
    let promises = [];

    if (updatedPreferredName)
    {
        promises.push(userDal.updatePreferredName(userId, updatedPreferredName));
    }

    if (!isNaN(updatedLowLimitWarning))
    {
        promises.push(userDal.updateLimitWarning(userId, updatedLowLimitWarning))
    }

    if (updatedPassword)
    {
        HashFactory.createHash(updatedPassword)
            .then((hash: FinancialPlanning.Server.Security.IPasswordHash) =>
            {
                promises.push(userDal.updatePassword(userId, hash));
            });
    }

    Promise.all(promises)
        .then(() =>
        {
            return httpResponse.status(HttpCodes.ok).send({});
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        });
});

/**
 * Login for user
 */
router.post('/login', passport.authenticate('local', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    var jwt: string = TokenFactory.generateJWT(httpRequest.user._id);
    return httpResponse.status(HttpCodes.ok).send(jwt);
});

/**
 * Update password for a user
 */
router.post('/updatePassword', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    var password = httpRequest.body.password;

    if (!password)
    {
        return httpResponse.status(HttpCodes.badRequest).send("No Password provided");
    }

    HashFactory.createHash(password)
        .then((hashResponse: FinancialPlanning.Server.Security.IPasswordHash) =>
        {
            var database = httpRequest.database;
            var userDal = new UserDal(database);
            var userId = httpRequest.user._id;

            userDal.updatePassword(userId, {hash: hashResponse.hash, salt: hashResponse.salt})
                .then((user: FinancialPlanning.Server.Users.IUser) =>
                {
                    var jwt = TokenFactory.generateJWT(user._id);
                    return httpResponse.status(HttpCodes.ok).send(jwt);
                });
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        });
});

/**
 * Check JWT status
 */
router.get('/status', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    //if execution arrives here, then the token has been validated. We can just return an OK response to the client
    return httpResponse.status(HttpCodes.ok).send({});
});

/**
 * Get user summary information
 */
router.get('/summary', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    var user = httpRequest.user;
    var userSummary: FinancialPlanning.Common.Users.IUserSummary = {
        name: user.options && user.options.preferredName ? user.options.preferredName : user._id,
        balance: user.balance
    };
    return httpResponse.status(HttpCodes.ok).send(userSummary);
});

/**
 *
 */
router.get('/details', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    let user = httpRequest.user;
    let userDetails: FinancialPlanning.Common.Users.IUserDetails = {
        preferredName: user.options.preferredName || "",
        lowLimitWarning: user.options.lowLimitWarning
    };
    return httpResponse.status(HttpCodes.ok).send(userDetails);
});

//router.get('/summary/balance', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
//{
//    var user = <FinancialPlanning.Server.Users.IUser>httpRequest.user;
//    var db = httpRequest.database;
//    var transactionDal = new TransactionDal(db);
//    var start = httpRequest.query.startDate;
//    if (!ObjectUtilities.isDefined(start, true))
//    {
//        return httpResponse.status(HttpCodes.badRequest).send("No start date provided");
//    }
//    var end = httpRequest.query.endDate;
//    if (!ObjectUtilities.isDefined(end, true))
//    {
//        return httpResponse.status(HttpCodes.badRequest).send("No end date provided");
//    }
//    var balance = user.balance;
//    var userId = user._id;
//
//    transactionDal.getTransactionsForUser(userId)
//        .then((transactions: Array<FinancialPlanning.Common.Transactions.ITransaction>) =>
//        {
//            var summaries = TransactionUtilities.createBalanceSummary(transactions, new Date(start), new Date(end), balance);
//            return httpResponse.status(HttpCodes.ok).send(summaries);
//        })
//        .catch((error: any) =>
//        {
//            return httpResponse.status(HttpCodes.internalServerError).send(error);
//        });
//});

//router.delete('/', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
//{
//    var database = httpRequest.database;
//    var userDal = new UserDal(database);
//    var userId = httpRequest.user;
//
//    userDal.deleteUser(userId)
//        .then((databaseResponse: any) =>
//        {
//            if (databaseResponse.result && databaseResponse.result.n && databaseResponse.result.n > 0)
//            {
//                return httpResponse.status(FinancialPlanning.Server.Http.HttpCodes.noContent).send({});
//            }
//            else
//            {
//                return httpResponse.status(HttpCodes.internalServerError).send("Could not delete user");
//            }
//        })
//        .catch((error: any) =>
//        {
//            return httpResponse.status(HttpCodes.internalServerError).send(error);
//        });
//});

module.exports = router;