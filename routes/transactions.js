/// <reference path="../typings/tsd.d.ts" />
var express = require("express");
var passport = require("passport");
var _ = require("underscore");
var ObjectUtilities = require("../utilities/ObjectUtilities");
var TransactionDal = require("../database/TransactionDal");
var TransactionFactory = require("../factories/TransactionFactory");
var TransactionTypeDal = require("../database/TransactionTypeDal");
var TransactionUtilities = require("../utilities/TransactionUtilities");
var UserDal = require("../database/UserDal");
var router = express.Router();
// Contains route definitons for transactions and transaction types
/**
 * GET outgoing transactions for user
 */
router.get('/', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var db = httpRequest.database;
    var user = httpRequest.user;
    var transactionDal = new TransactionDal(db);
    var userDal = new UserDal(db);
    var startDate = httpRequest.query.startDate;
    var endDate = httpRequest.query.endDate;
    transactionDal.getTransactionsForUser(user._id)
        .then(function (transactions) {
        var upToDateTransactions = transactions.map(function (transaction) {
            return TransactionUtilities.bringRecurringTransactionUpToDate(transaction);
        });
        var balance = user.balance;
        balance = TransactionUtilities.applyTransactionsToBalance(upToDateTransactions, balance);
        userDal.updateBalance(user._id, balance)
            .then(function () {
            var promises = [];
            upToDateTransactions.forEach(function (transaction) {
                promises.push(transactionDal.updateTransaction(transaction._id, transaction));
            });
            Promise.all(promises)
                .then(function (savedTransactions) {
                var filtered = TransactionUtilities.filterTransactionsByDate(savedTransactions, startDate, endDate);
                return httpResponse.status(200 /* ok */).send(filtered);
            });
        });
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * GET totals for incoming transactions for user
 */
router.get('/incoming/totals', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var userId = httpRequest.user._id;
    var db = httpRequest.database;
    var transactionDal = new TransactionDal(db);
    transactionDal.getTransactionsForUser(userId)
        .then(function (transactions) {
        var filtered = TransactionUtilities.removeOutgoingTransactions(transactions);
        var totals = TransactionUtilities.totalTransactionsByMonth(filtered);
        return httpResponse.status(200 /* ok */).send(totals);
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * GET totals for outgoing transactions for user
 */
router.get('/outgoing/totals', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var userId = httpRequest.user._id;
    var db = httpRequest.database;
    var transactionDal = new TransactionDal(db);
    transactionDal.getTransactionsForUser(userId)
        .then(function (transactions) {
        var filtered = TransactionUtilities.removeIncomingTransactions(transactions);
        var totals = TransactionUtilities.totalTransactionsByMonth(filtered);
        return httpResponse.status(200 /* ok */).send(totals);
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * GET recurring transactions for user
 */
router.get('/recurring', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var db = httpRequest.database;
    var user = httpRequest.user;
    var transactionDal = new TransactionDal(db);
    var userDal = new UserDal(db);
    transactionDal.getTransactionsForUser(user._id)
        .then(function (transactions) {
        var upToDateTransactions = transactions.map(function (transaction) {
            return TransactionUtilities.bringRecurringTransactionUpToDate(transaction);
        });
        var balance = user.balance;
        balance = TransactionUtilities.applyTransactionsToBalance(upToDateTransactions, balance);
        userDal.updateBalance(user._id, balance)
            .then(function () {
            var promises = [];
            upToDateTransactions.forEach(function (transaction) {
                promises.push(transactionDal.updateTransaction(transaction._id, transaction));
            });
            Promise.all(promises)
                .then(function (savedTransactions) {
                var filtered = savedTransactions.filter(function (x) { return x.hasOwnProperty('isActive'); });
                return httpResponse.status(200 /* ok */).send(filtered);
            });
        });
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * GET transaction summaries for user
 */
router.get('/summaries', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var db = httpRequest.database;
    var user = httpRequest.user;
    var transactionDal = new TransactionDal(db);
    var userDal = new UserDal(db);
    var startDate = httpRequest.query.startDate;
    var endDate = httpRequest.query.endDate;
    transactionDal.getTransactionsForUser(user._id)
        .then(function (transactions) {
        var upToDateTransactions = transactions.map(function (transaction) {
            return TransactionUtilities.bringRecurringTransactionUpToDate(transaction);
        });
        var balance = user.balance;
        balance = TransactionUtilities.applyTransactionsToBalance(upToDateTransactions, balance);
        userDal.updateBalance(user._id, balance)
            .then(function () {
            var promises = [];
            upToDateTransactions.forEach(function (transaction) {
                promises.push(transactionDal.updateTransaction(transaction._id, transaction));
            });
            Promise.all(promises)
                .then(function (savedTransactions) {
                var filtered = TransactionUtilities.filterTransactionsByDate(savedTransactions, startDate, endDate);
                filtered = TransactionUtilities.removeIncomingTransactions(filtered);
                var summaryPromises = [];
                filtered.forEach(function (transactionInstance) {
                    var transactionTypeDal = new TransactionTypeDal(db);
                    summaryPromises.push(TransactionUtilities.createTransactionSummaries(transactionInstance, transactionTypeDal, user._id));
                });
                Promise.all(summaryPromises)
                    .then(function (summaries) {
                    httpResponse.status(200 /* ok */).send(_.flatten(summaries));
                })
                    .catch(function (error) {
                    return httpResponse.status(500 /* internalServerError */).send(error.message || error);
                });
            })
                .catch(function (error) {
                return httpResponse.status(500 /* internalServerError */).send(error.message || error);
            });
        });
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * GET all transaction types for user
 */
router.get('/types', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var database = httpRequest.database;
    var transactionTypeDal = new TransactionTypeDal(database);
    var userId = httpRequest.user._id;
    transactionTypeDal.getAllTransactionTypesByUserId(userId)
        .then(function (response) {
        return httpResponse.status(200 /* ok */).send(response);
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * POST new transaction
 */
router.post('/', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var userId = httpRequest.user._id;
    var database = httpRequest.database;
    var adjustment = httpRequest.body.adjustment;
    if (!ObjectUtilities.isDefined(adjustment)) {
        httpResponse.status(400 /* badRequest */).send("No transaction adjustment provided");
    }
    var transactionTypeId = httpRequest.body.transactionTypeId;
    if (!ObjectUtilities.isDefined(transactionTypeId, true)) {
        httpResponse.status(400 /* badRequest */).send("No transaction transactionTypeId provided");
    }
    var dateString = httpRequest.body.date;
    if (!ObjectUtilities.isDefined(dateString, true)) {
        httpResponse.status(400 /* badRequest */).send("No transaction transactionTypeId provided");
    }
    var transactionTypeDal = new TransactionTypeDal(database);
    transactionTypeDal.checkTransactionTypeExists(transactionTypeId)
        .then(function (response) {
        if (!response) {
            return httpResponse.status(400 /* badRequest */).send("TransactionTypeId does not exist");
        }
        var transaction = TransactionFactory.createNewTransactionInstance(transactionTypeId, userId, new Date(dateString), adjustment);
        var balance = httpRequest.user.balance;
        balance = TransactionUtilities.applyTransactionsToBalance([transaction], balance);
        var userDal = new UserDal(database);
        userDal.updateBalance(userId, balance)
            .then(function () {
            var transactionDal = new TransactionDal(database);
            transactionDal.createTransaction(transaction)
                .then(function (response) {
                return httpResponse.status(200 /* ok */).send(response);
            });
        });
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * POST new recurring transaction
 */
router.post('/recurring', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var userId = httpRequest.user._id;
    var database = httpRequest.database;
    var adjustment = httpRequest.body.adjustment;
    if (!ObjectUtilities.isDefined(adjustment)) {
        httpResponse.status(400 /* badRequest */).send("No transaction adjustment provided");
    }
    var transactionTypeId = httpRequest.body.transactionTypeId;
    if (!ObjectUtilities.isDefined(transactionTypeId, true)) {
        httpResponse.status(400 /* badRequest */).send("No transaction transactionTypeId provided");
    }
    var startDateString = httpRequest.body.startDate;
    if (!ObjectUtilities.isDefined(startDateString, true)) {
        httpResponse.status(400 /* badRequest */).send("No transaction startDate provided");
    }
    var transactionTypeDal = new TransactionTypeDal(database);
    transactionTypeDal.checkTransactionTypeExists(transactionTypeId)
        .then(function (response) {
        if (!response) {
            return httpResponse.status(400 /* badRequest */).send("TransactionTypeId does not exist");
        }
        var transaction = TransactionFactory.createNewRecurringTransactionInstance(transactionTypeId, userId, new Date(startDateString), adjustment);
        var balance = httpRequest.user.balance;
        balance = TransactionUtilities.applyTransactionsToBalance([transaction], balance);
        var userDal = new UserDal(database);
        userDal.updateBalance(userId, balance)
            .then(function () {
            var transactionDal = new TransactionDal(database);
            transactionDal.createTransaction(transaction)
                .then(function (response) {
                return httpResponse.status(200 /* ok */).send(response);
            });
        });
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * POST new transaction type
 */
router.post('/type', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var database = httpRequest.database;
    var name = httpRequest.body.name;
    var userId = httpRequest.user._id;
    if (!ObjectUtilities.isDefined(name, true)) {
        return httpResponse.status(400 /* badRequest */).send("No transaction type 'name' provided");
    }
    var paymentDirection = httpRequest.body.paymentDirection;
    if (!ObjectUtilities.isDefined(paymentDirection, true)) {
        return httpResponse.status(400 /* badRequest */).send("No transaction type 'paymentDirection' provided");
    }
    var classification = httpRequest.body.classification;
    if (!ObjectUtilities.isDefined(classification, true)) {
        return httpResponse.status(400 /* badRequest */).send("No transaction type 'classification' provided");
    }
    var isTaxable = httpRequest.body.isTaxable;
    if (!ObjectUtilities.isDefined(classification, true)) {
        return httpResponse.status(400 /* badRequest */).send("No transaction type 'isTaxable' provided");
    }
    var subClassification = httpRequest.body.subClassification;
    var transactionType = TransactionFactory.createNewTransactionType(name, paymentDirection, classification, userId, isTaxable, subClassification);
    var transactionTypeDal = new TransactionTypeDal(database);
    transactionTypeDal.createTransactionType(transactionType)
        .then(function (transactionType) {
        return httpResponse.status(200 /* ok */).send(transactionType);
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * POST recurring transaction cancellation request
 */
router.post('/recurring/cancel', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var database = httpRequest.database;
    var transactionId = httpRequest.body.transactionId;
    if (!transactionId) {
        return httpResponse.status(400 /* badRequest */).send("No transaction ID specified in request");
    }
    var transactionDal = new TransactionDal(database);
    transactionDal.toggleRecurringTransactionInstanceStatus(transactionId)
        .then(function (response) {
        httpResponse.status(200 /* ok */).send(response);
    })
        .catch(function (error) {
        console.log(error);
        httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
/**
 * PUT existing transaction type
 */
router.put('/type', passport.authenticate('jwt', { session: false }), function (httpRequest, httpResponse) {
    var database = httpRequest.database;
    var transactionTypeDal = new TransactionTypeDal(database);
    var transactionTypeId = httpRequest.body._id;
    var paymentDirection = httpRequest.body.paymentDirection;
    var name = httpRequest.body.name;
    var classification = httpRequest.body.classification;
    var subClassification = httpRequest.body.subClassification;
    if (!ObjectUtilities.isDefined(transactionTypeId, true)) {
        return httpResponse.status(400 /* badRequest */).send("No transaction type '_id' provided");
    }
    transactionTypeDal.updateTransactionType(transactionTypeId, name, classification, subClassification)
        .then(function (response) {
        return httpResponse.status(200 /* ok */).send(response);
    })
        .catch(function (error) {
        return httpResponse.status(500 /* internalServerError */).send(error.message || error);
    });
});
module.exports = router;
//# sourceMappingURL=transactions.js.map