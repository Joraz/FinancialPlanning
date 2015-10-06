/// <reference path="../typings/tsd.d.ts" />
var moment = require("moment");
require("moment-range");
var _ = require("underscore");
var DateUtilities = require("./DateUtilities");
var ObjectUtilities = require("./ObjectUtilities");
var UuidUtilities = require("./UuidUtilities");
/**
 * Utility class for dealing with transactions and transaction types
 */
var TransactionUtilities = (function () {
    function TransactionUtilities() {
    }
    /**
     * Apply any unprocessed transactions to the given balance and return it
     * @param transactionInstances
     * @param balance
     * @returns {number}
     */
    TransactionUtilities.applyTransactionsToBalance = function (transactionInstances, balance) {
        if (!ObjectUtilities.isDefined(transactionInstances)) {
            throw new Error("No 'transactionInstances' parameter specified in TransactionUtilities::applyTransactionsToBalance().");
        }
        if (!ObjectUtilities.isDefined(balance)) {
            throw new Error("No 'balance' parameter specified in TransactionUtilities::applyTransactionsToBalance().");
        }
        transactionInstances.forEach(function (transactionInstance) {
            transactionInstance.transactions.forEach(function (transaction) {
                if (!transaction.processed) {
                    var transactionMoment = moment(transaction.transactionDate);
                    if (DateUtilities.isDue(transactionMoment)) {
                        balance += transactionInstance.adjustment;
                        transaction.processed = true;
                        transaction.processedDate = new Date();
                    }
                }
            });
        });
        return balance;
    };
    /**
     * Filter out transaction types that do not belong to the given user
     * @param transactionTypes
     * @param userId
     * @returns {FinancialPlanning.Common.Transactions.ITransactionType[]}
     */
    TransactionUtilities.filterTransactionTypesByUser = function (transactionTypes, userId) {
        if (!ObjectUtilities.isDefined(transactionTypes)) {
            throw new Error("No 'transactionTypes' parameter provided in TransactionUtilities::filterTransactionTypesByUser().");
        }
        return transactionTypes.filter(function (transactionType) {
            if (transactionType.isDefault) {
                return true;
            }
            // there is a user property, so we can only return true if the userId matches
            return transactionType.userId === userId;
        });
    };
    /**
     * Filter transactions by a date range. If no dates given will return the array unchanged
     * @param transactionInstances
     * @param startDate
     * @param endDate
     * @returns {FinancialPlanning.Common.Transactions.ITransactionInstance[]}
     */
    TransactionUtilities.filterTransactionsByDate = function (transactionInstances, startDate, endDate) {
        var startMoment, endMoment;
        if (startDate) {
            startMoment = moment(startDate);
        }
        if (endDate) {
            endMoment = moment(endDate);
        }
        return transactionInstances.filter(function (transactionInstance) {
            transactionInstance.transactions = transactionInstance.transactions.filter(function (transaction) {
                if (startDate || endDate) {
                    var transactionMoment = moment(transaction.transactionDate);
                    if (startMoment && endMoment) {
                        return transactionMoment.isBetween(startMoment, endMoment, "day");
                    }
                    else if (startMoment) {
                        return transactionMoment.isAfter(startMoment, "day");
                    }
                    else if (endMoment) {
                        return transactionMoment.isBefore(endMoment, "day");
                    }
                    else {
                        return true;
                    }
                }
            });
            return transactionInstance.transactions.length > 0;
        });
    };
    /**
     * Populate unprocessed transactions on a new recurring transaction instance to bring it up to date
     * @param fromDate
     * @returns {Array<FinancialPlanning.Common.Transactions.ITransaction>}
     */
    TransactionUtilities.createTransactionsForNewRecurringInstance = function (fromDate) {
        if (!ObjectUtilities.isDefined(fromDate)) {
            throw new Error("No 'fromDate' parameter provided in TransactionUtilities::createTransactionsForNewRecurringInstance().");
        }
        var transactions = [];
        if (!ObjectUtilities.isDefined(fromDate)) {
            return transactions;
        }
        var startMoment = moment(fromDate);
        var endMoment = moment();
        var range = moment.range(startMoment, endMoment);
        range.by("months", function (moment) {
            var transaction = {
                _id: UuidUtilities.createNewMongodbId(),
                processed: false,
                transactionDate: moment.toDate()
            };
            transactions.push(transaction);
        });
        // We must have at least one transaction
        if (transactions.length === 0) {
            var transaction = {
                _id: UuidUtilities.createNewMongodbId(),
                processed: false,
                transactionDate: fromDate
            };
            transactions.push(transaction);
        }
        return transactions;
    };
    /**
     * Create unprocessed transactions on a recurring transaction instance to bring it up to date
     * @param transactionInstance
     * @param end
     * @returns {FinancialPlanning.Common.Transactions.IRecurringTransactionInstance}
     */
    TransactionUtilities.bringRecurringTransactionUpToDate = function (transactionInstance, end) {
        if (!ObjectUtilities.isDefined(transactionInstance)) {
            throw new Error("No 'transactionInstance' parameter provided in TransactionUtilities::bringRecurringTransactionUpToDate().");
        }
        if (!transactionInstance.isActive) {
            return transactionInstance;
        }
        var transactions = transactionInstance.transactions;
        if (transactions.length === 0) {
            throw new Error("Could not bring transactionInstance '" + transactionInstance._id + "' up to date. Fatal error encountered.");
        }
        var index = transactions.length - 1;
        var transaction;
        while (index >= 0) {
            var current = transactions[index];
            if (current.processed) {
                transaction = current;
                break;
            }
            index--;
        }
        if (!transaction) {
            return transactionInstance;
        }
        var startMoment = moment(transaction.transactionDate).add(1, "months");
        var endMoment = end ? moment(end) : moment();
        var range = moment.range(startMoment, endMoment);
        range.by("months", function (moment) {
            var transaction = {
                _id: UuidUtilities.createNewMongodbId(),
                processed: false,
                transactionDate: moment.toDate()
            };
            transactionInstance.transactions.push(transaction);
        });
        return transactionInstance;
    };
    /**
     * Create transaction summaries from a transaction instance
     * @param transactionInstance
     * @param transactionTypeDal
     * @returns {Promise}
     */
    TransactionUtilities.createTransactionSummaries = function (transactionInstance, transactionTypeDal, userId) {
        return new Promise(function (resolve, reject) {
            var summaries = [];
            transactionTypeDal.getTransactionType(transactionInstance.transactionTypeId, userId)
                .then(function (transactionType) {
                transactionInstance.transactions.forEach(function (transaction) {
                    var summary = {
                        _id: transaction._id,
                        classification: transactionType.classification,
                        subClassification: transactionType.subClassification,
                        name: transactionType.name,
                        transactionDate: transaction.transactionDate,
                        adjustment: transactionInstance.adjustment
                    };
                    summaries.push(summary);
                });
                return resolve(summaries);
            })
                .catch(reject);
        });
    };
    /**
     * Create balance summaries from an array of transactions
     * @param transactions
     * @param startDate
     * @param endDate
     * @param currentBalance
     * @returns {FinancialPlanning.Common.Users.IBalanceSummary[]}
     */
    TransactionUtilities.createBalanceSummary = function (transactions, startDate, endDate, currentBalance) {
        var dates = [];
        var dateSummaries = [];
        var balance = currentBalance;
        var startMoment = moment(startDate);
        var endMoment = moment(endDate);
        var range = moment.range(startMoment, endMoment);
        var adjustments = TransactionUtilities.createAdjustmentSummary(transactions);
        range.by("days", function (moment) {
            dates.push(moment.toDate());
        });
        var newBalance = balance;
        while (dates.length > 0) {
            var date = dates.pop();
            var match = _.where(adjustments, { date: moment(date).format("YYYY-MM-DD") });
            if (match) {
                match.forEach(function (adjustment) {
                    var adj = adjustment.adjustment.toFixed(2);
                    newBalance -= parseFloat(adj);
                });
            }
            dateSummaries.push({
                date: date,
                balance: newBalance
            });
        }
        return dateSummaries.reverse();
    };
    /**
     * Create adjustment summaries from an array of transactions
     * @param transactions
     */
    TransactionUtilities.createAdjustmentSummary = function (transactions) {
        var summaries = [];
        transactions.forEach(function (transactionInstance) {
            transactionInstance.transactions.forEach(function (transaction) {
                summaries.push({
                    date: moment(transaction.transactionDate).format("YYYY-MM-DD"),
                    adjustment: transactionInstance.adjustment
                });
            });
        });
        return summaries;
    };
    /**
     * Filter out incoming transactions
     * @param transactionInstances
     * @returns {FinancialPlanning.Common.Transactions.ITransactionInstance[]}
     */
    TransactionUtilities.removeIncomingTransactions = function (transactionInstances) {
        return transactionInstances.filter(function (transactionInstance) {
            return Math.abs(transactionInstance.adjustment) !== transactionInstance.adjustment;
        });
    };
    /**
     * Filter out outgoing transactions
     * @param transactionInstances
     * @returns {FinancialPlanning.Common.Transactions.ITransactionInstance[]}
     */
    TransactionUtilities.removeOutgoingTransactions = function (transactionInstances) {
        return transactionInstances.filter(function (transactionInstance) {
            return Math.abs(transactionInstance.adjustment) === transactionInstance.adjustment;
        });
    };
    /**
     * Create a balance forecast from current recurring transactions
     * @param recurringTransactions
     * @param balance
     * @returns {Array<FinancialPlanning.Common.Users.IBalanceSummary>}
     */
    TransactionUtilities.createBalanceForecast = function (recurringTransactions, balance) {
        var summaries = [];
        var futureTransactionInstances = recurringTransactions
            .map(function (x) { return TransactionUtilities.bringRecurringTransactionUpToDate(x, moment().add(3, "months").toDate()); });
        var futureTransactions = [];
        futureTransactionInstances.forEach(function (transactionInstance) {
            transactionInstance.transactions.forEach(function (transaction) {
                if (!transaction.processed) {
                    futureTransactions.push({
                        date: moment(transaction.transactionDate).format("YYYY-MM-DD"),
                        adjustment: transactionInstance.adjustment
                    });
                }
            });
        });
        var start = moment();
        var end = moment().add(3, "months");
        var previousMoment = moment();
        var range = moment.range(start, end);
        range.by("weeks", function (cMoment) {
            futureTransactions.forEach(function (fTransaction) {
                var transactionMoment = moment(new Date(fTransaction.date));
                if (transactionMoment.isBetween(previousMoment, cMoment)) {
                    balance += fTransaction.adjustment;
                }
            });
            summaries.push({
                date: cMoment.toDate(),
                balance: balance
            });
            previousMoment = cMoment;
        });
        return summaries;
    };
    /**
     * Create totals for the given transactions filtered by month
     * @param transactions
     * @returns {Array<FinancialPlanning.Common.Transactions.IMonthTotal>}
     */
    TransactionUtilities.totalTransactionsByMonth = function (transactions) {
        var totals = [];
        var now = moment().add(1, "months");
        var then = moment().add(1, "months").subtract(1, "years");
        var range = moment.range(then, now);
        range.by("months", function (cMoment) {
            // create a range for the whole month
            var monthStart = cMoment.clone().startOf("month");
            var monthEnd = cMoment.clone().endOf("month");
            var transactionsForMonth = [];
            transactions.forEach(function (transactionInstance) {
                transactionInstance.transactions.forEach(function (transaction) {
                    if (moment(transaction.transactionDate).isBetween(monthStart, monthEnd)) {
                        transactionsForMonth.push(Math.abs(transactionInstance.adjustment));
                    }
                });
            });
            var total = 0;
            transactionsForMonth.forEach(function (x) { return total += x; });
            totals.push({ month: cMoment.format("MMM"), total: total });
        }, true);
        return totals;
    };
    return TransactionUtilities;
})();
module.exports = TransactionUtilities;
//# sourceMappingURL=TransactionUtilities.js.map