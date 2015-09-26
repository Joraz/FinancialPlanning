/// <reference path="../typings/tsd.d.ts" />

import express = require("express");
import passport = require("passport");
import passportJWT = require("passport-jwt");
import _ = require("underscore");

import HttpCodes = require("../enums/HttpCodes");
import ObjectUtilities = require("../utilities/ObjectUtilities");
import TransactionDal = require("../database/TransactionDal");
import TransactionFactory = require("../factories/TransactionFactory");
import TransactionTypeDal = require("../database/TransactionTypeDal");
import TransactionUtilities = require("../utilities/TransactionUtilities");
import UserDal = require("../database/UserDal");

var router: express.Router = express.Router();

/**
 * GET outgoing transactions for user
 */
router.get('/', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    let db = httpRequest.database;
    let user = httpRequest.user;
    let transactionDal = new TransactionDal(db);
    let userDal = new UserDal(db);
    let startDate = httpRequest.query.startDate;
    let endDate = httpRequest.query.endDate;

    transactionDal.getTransactionsForUser(user._id)
        .then((transactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>) =>
        {
            let upToDateTransactions = transactions.map((transaction: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
            {
                return TransactionUtilities.bringRecurringTransactionUpToDate(<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>transaction);
            });

            var balance = user.balance;
            balance = TransactionUtilities.applyTransactionsToBalance(upToDateTransactions, balance);

            userDal.updateBalance(user._id, balance)
                .then(() =>
                {
                    let promises = [];
                    upToDateTransactions.forEach((transaction: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
                    {
                        promises.push(transactionDal.updateTransaction(transaction._id, transaction));
                    });

                    Promise.all(promises)
                        .then((savedTransactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>) =>
                        {
                            let filtered = TransactionUtilities.filterTransactionsByDate(savedTransactions, startDate, endDate);
                            return httpResponse.status(HttpCodes.ok).send(filtered);
                        });
                });
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        });
});

/**
 *
 */
router.get('/incoming/totals', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    let userId = httpRequest.user._id;
    let db = httpRequest.database;
    let transactionDal = new TransactionDal(db);
    transactionDal.getTransactionsForUser(userId)
        .then((transactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>) =>
        {
            let filtered = TransactionUtilities.removeOutgoingTransactions(transactions);
            let totals = TransactionUtilities.totalTransactionsByMonth(filtered);
            return httpResponse.status(HttpCodes.ok).send(totals);
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        });
});

/**
 *
 */
router.get('/outgoing/totals', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    let userId = httpRequest.user._id;
    let db = httpRequest.database;
    let transactionDal = new TransactionDal(db);
    transactionDal.getTransactionsForUser(userId)
        .then((transactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>) =>
        {
            let filtered = TransactionUtilities.removeIncomingTransactions(transactions);
            let totals = TransactionUtilities.totalTransactionsByMonth(filtered);
            return httpResponse.status(HttpCodes.ok).send(totals);
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        });
});

/**
 * GET recurring transactions for user
 */
router.get('/recurring', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    let db = httpRequest.database;
    let user = httpRequest.user;
    let transactionDal = new TransactionDal(db);
    let userDal = new UserDal(db);

    transactionDal.getTransactionsForUser(user._id)
        .then((transactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>) =>
        {
            let upToDateTransactions = transactions.map((transaction: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
            {
                return TransactionUtilities.bringRecurringTransactionUpToDate(<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>transaction);
            });

            var balance = user.balance;
            balance = TransactionUtilities.applyTransactionsToBalance(upToDateTransactions, balance);

            userDal.updateBalance(user._id, balance)
                .then(() =>
                {
                    let promises = [];
                    upToDateTransactions.forEach((transaction: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
                    {
                        promises.push(transactionDal.updateTransaction(transaction._id, transaction));
                    });

                    Promise.all(promises)
                        .then((savedTransactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>) =>
                        {
                            let filtered = savedTransactions.filter(x => x.hasOwnProperty('isActive'));
                            return httpResponse.status(HttpCodes.ok).send(filtered);
                        });
                });
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        });
});

/**
 * GET transaction summaries for user
 */
router.get('/summaries', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    var db = httpRequest.database;
    var user = httpRequest.user;
    var transactionDal = new TransactionDal(db);
    var userDal = new UserDal(db);
    var startDate = httpRequest.query.startDate;
    var endDate = httpRequest.query.endDate;

    transactionDal.getTransactionsForUser(user._id)
        .then((transactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>) =>
        {
            let upToDateTransactions = transactions.map((transaction: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
            {
                return TransactionUtilities.bringRecurringTransactionUpToDate(<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>transaction);
            });

            var balance = user.balance;
            balance = TransactionUtilities.applyTransactionsToBalance(upToDateTransactions, balance);

            userDal.updateBalance(user._id, balance)
                .then(() =>
                {
                    let promises = [];
                    upToDateTransactions.forEach((transaction: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
                    {
                        promises.push(transactionDal.updateTransaction(transaction._id, transaction));
                    });

                    Promise.all(promises)
                        .then((savedTransactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>) =>
                        {
                            let filtered = TransactionUtilities.filterTransactionsByDate(savedTransactions, startDate, endDate);
                            filtered = TransactionUtilities.removeIncomingTransactions(filtered);
                            let summaryPromises: Array<Promise<Array<FinancialPlanning.Common.Transactions.ITransactionSummary>>> = [];
                            filtered.forEach((transactionInstance: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
                            {
                                var transactionTypeDal = new TransactionTypeDal(db);
                                summaryPromises.push(TransactionUtilities.createTransactionSummaries(transactionInstance, transactionTypeDal, user._id));
                            });

                            Promise.all(summaryPromises)
                                .then((summaries: Array<Array<FinancialPlanning.Common.Transactions.ITransactionSummary>>) =>
                                {
                                    httpResponse.status(HttpCodes.ok).send(_.flatten(summaries));
                                })
                                .catch((error: any) =>
                                {
                                    return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
                                });
                        })
                        .catch((error: any) =>
                        {
                            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
                        });
                });
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        })
});

/**
 * CREATE new transaction instance
 */
router.post('/', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    var userId: string = httpRequest.user._id;
    var database = httpRequest.database;
    var adjustment: number = httpRequest.body.adjustment;
    if (!ObjectUtilities.isDefined(adjustment))
    {
        httpResponse.status(HttpCodes.badRequest).send("No transaction adjustment provided");
    }

    var transactionTypeId: string = httpRequest.body.transactionTypeId;
    if (!ObjectUtilities.isDefined(transactionTypeId, true))
    {
        httpResponse.status(HttpCodes.badRequest).send("No transaction transactionTypeId provided");
    }

    var dateString = httpRequest.body.date;
    if (!ObjectUtilities.isDefined(dateString, true))
    {
        httpResponse.status(HttpCodes.badRequest).send("No transaction transactionTypeId provided");
    }

    var transactionTypeDal = new TransactionTypeDal(database);
    transactionTypeDal.checkTransactionTypeExists(transactionTypeId)
        .then((response: boolean) =>
        {
            if (!response)
            {
                return httpResponse.status(HttpCodes.badRequest).send("TransactionTypeId does not exist");
            }

            var transaction = TransactionFactory.createNewTransactionInstance(transactionTypeId, userId, new Date(dateString), adjustment);
            var balance = httpRequest.user.balance;
            balance = TransactionUtilities.applyTransactionsToBalance([transaction], balance);

            var userDal = new UserDal(database);
            userDal.updateBalance(userId, balance)
                .then(() =>
                {
                    var transactionDal = new TransactionDal(database);
                    transactionDal.createTransaction(transaction)
                        .then((response: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
                        {
                            return httpResponse.status(HttpCodes.ok).send(response);
                        });
                })
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        });
});

/**
 * CREATE new recurring transaction instance
 */
router.post('/recurring', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    var userId: string = httpRequest.user._id;
    var database = httpRequest.database;
    var adjustment: number = httpRequest.body.adjustment;
    if (!ObjectUtilities.isDefined(adjustment))
    {
        httpResponse.status(HttpCodes.badRequest).send("No transaction adjustment provided");
    }

    var transactionTypeId: string = httpRequest.body.transactionTypeId;
    if (!ObjectUtilities.isDefined(transactionTypeId, true))
    {
        httpResponse.status(HttpCodes.badRequest).send("No transaction transactionTypeId provided");
    }
    var startDateString: string = httpRequest.body.startDate;
    if (!ObjectUtilities.isDefined(startDateString, true))
    {
        httpResponse.status(HttpCodes.badRequest).send("No transaction startDate provided");
    }

    var transactionTypeDal = new TransactionTypeDal(database);
    transactionTypeDal.checkTransactionTypeExists(transactionTypeId)
        .then((response: boolean) =>
        {
            if (!response)
            {
                return httpResponse.status(HttpCodes.badRequest).send("TransactionTypeId does not exist");
            }

            var transaction = TransactionFactory.createNewRecurringTransactionInstance(transactionTypeId, userId, new Date(startDateString), adjustment);
            var balance = httpRequest.user.balance;
            balance = TransactionUtilities.applyTransactionsToBalance([transaction], balance);

            var userDal = new UserDal(database);
            userDal.updateBalance(userId, balance)
                .then(() =>
                {
                    var transactionDal = new TransactionDal(database);
                    transactionDal.createTransaction(transaction)
                        .then((response: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
                        {
                            return httpResponse.status(HttpCodes.ok).send(response);
                        });
                });
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        });
});

/**
 * CREATE new transaction type
 */
router.post('/type', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    var database = httpRequest.database;
    var name = httpRequest.body.name;
    var userId = httpRequest.user._id;
    if (!ObjectUtilities.isDefined(name, true))
    {
        return httpResponse.status(HttpCodes.badRequest).send("No transaction type 'name' provided");
    }

    var paymentDirection = httpRequest.body.paymentDirection;
    if (!ObjectUtilities.isDefined(paymentDirection, true))
    {
        return httpResponse.status(HttpCodes.badRequest).send("No transaction type 'paymentDirection' provided");
    }

    var classification = httpRequest.body.classification;
    if (!ObjectUtilities.isDefined(classification, true))
    {
        return httpResponse.status(HttpCodes.badRequest).send("No transaction type 'classification' provided");
    }

    var isTaxable = httpRequest.body.isTaxable;
    if (!ObjectUtilities.isDefined(classification, true))
    {
        return httpResponse.status(HttpCodes.badRequest).send("No transaction type 'isTaxable' provided");
    }

    var subClassification = httpRequest.body.subClassification;

    var transactionType = TransactionFactory.createNewTransactionType(name, paymentDirection, classification, userId, isTaxable, subClassification);
    var transactionTypeDal = new TransactionTypeDal(database);

    transactionTypeDal.createTransactionType(transactionType)
        .then((transactionType: FinancialPlanning.Common.Transactions.ITransactionType) =>
        {
            return httpResponse.status(HttpCodes.ok).send(transactionType);
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        });
});

/**
 * UPDATE existing transaction type
 */
router.put('/type', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    var database = httpRequest.database;
    var transactionTypeDal = new TransactionTypeDal(database);
    var transactionTypeId = httpRequest.body._id;
    var paymentDirection = httpRequest.body.paymentDirection;
    var name = httpRequest.body.name;
    var classification = httpRequest.body.classification;
    var subClassification = httpRequest.body.subClassification;

    if (!ObjectUtilities.isDefined(transactionTypeId, true))
    {
        return httpResponse.status(HttpCodes.badRequest).send("No transaction type '_id' provided");
    }

    transactionTypeDal.updateTransactionType(transactionTypeId, name, classification, subClassification)
        .then((response: FinancialPlanning.Common.Transactions.ITransactionType) =>
        {
            return httpResponse.status(HttpCodes.ok).send(response);
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        });
});

/**
 * GET all transaction types for user
 */
router.get('/types', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    var database = httpRequest.database;
    var transactionTypeDal = new TransactionTypeDal(database);
    var userId = httpRequest.user._id;

    transactionTypeDal.getAllTransactionTypesByUserId(userId)
        .then((response: Array<FinancialPlanning.Common.Transactions.ITransactionType>) =>
        {
            return httpResponse.status(HttpCodes.ok).send(response);
        })
        .catch((error: any) =>
        {
            return httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        });
});

/**
 * CANCEL recurring transaction
 */
router.post('/recurring/cancel', passport.authenticate('jwt', {session: false}), (httpRequest: express.Request, httpResponse: express.Response) =>
{
    var database = httpRequest.database;
    var transactionId = httpRequest.body.transactionId;

    if (!transactionId)
    {
        return httpResponse.status(HttpCodes.badRequest).send("No transaction ID specified in request");
    }

    var transactionDal = new TransactionDal(database);
    transactionDal.toggleRecurringTransactionInstanceStatus(transactionId)
        .then((response: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance) =>
        {
            httpResponse.status(HttpCodes.ok).send(response);
        })
        .catch((error: any) =>
        {
            console.log(error);
            httpResponse.status(HttpCodes.internalServerError).send(error.message || error);
        });
});

module.exports = router;