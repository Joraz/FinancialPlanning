/// <reference path="../typings/tsd.d.ts" />

import moment = require("moment");
require("moment-range");
import _ = require("underscore");

import DateUtilities = require("./DateUtilities");
import ObjectUtilities = require("./ObjectUtilities");
import UuidUtilities = require("./UuidUtilities");

/**
 * Utility class for dealing with transactions and transaction types
 */
class TransactionUtilities
{
    /**
     * Apply any unprocessed transactions to the given balance and return it
     * @param transactionInstances
     * @param balance
     * @returns {number}
     */
    public static applyTransactionsToBalance(transactionInstances: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>, balance: number): number
    {
        if (!ObjectUtilities.isDefined(transactionInstances))
        {
            throw new Error("No 'transactionInstances' parameter specified in TransactionUtilities::applyTransactionsToBalance().");
        }

        if (!ObjectUtilities.isDefined(balance))
        {
            throw new Error("No 'balance' parameter specified in TransactionUtilities::applyTransactionsToBalance().");
        }

        transactionInstances.forEach((transactionInstance: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
        {
            transactionInstance.transactions.forEach((transaction: FinancialPlanning.Common.Transactions.ITransaction) =>
            {
                if (!transaction.processed)
                {
                    var transactionMoment = moment(transaction.transactionDate);

                    if (DateUtilities.isDue(transactionMoment))
                    {
                        balance += transactionInstance.adjustment;
                        transaction.processed = true;
                        transaction.processedDate = new Date();
                    }
                }
            });
        });

        return balance;
    }

    /**
     * Filter out transaction types that do not belong to the given user
     * @param transactionTypes
     * @param userId
     * @returns {FinancialPlanning.Common.Transactions.ITransactionType[]}
     */
    public static filterTransactionTypesByUser(transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>, userId?: string): Array<FinancialPlanning.Common.Transactions.ITransactionType>
    {
        if (!ObjectUtilities.isDefined(transactionTypes))
        {
            throw new Error("No 'transactionTypes' parameter provided in TransactionUtilities::filterTransactionTypesByUser().");
        }

        return transactionTypes.filter((transactionType: FinancialPlanning.Common.Transactions.ITransactionType) =>
        {
            if (transactionType.isDefault)
            {
                return true;
            }

            // there is a user property, so we can only return true if the userId matches
            return transactionType.userId === userId;
        });
    }

    /**
     * Filter transactions by a date range. If no dates given will return the array unchanged
     * @param transactionInstances
     * @param startDate
     * @param endDate
     * @returns {FinancialPlanning.Common.Transactions.ITransactionInstance[]}
     */
    public static filterTransactionsByDate(transactionInstances: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>, startDate?: Date, endDate?: Date): Array<FinancialPlanning.Common.Transactions.ITransactionInstance>
    {
        let startMoment, endMoment;

        if (startDate)
        {
            startMoment = moment(startDate);
        }

        if (endDate)
        {
            endMoment = moment(endDate);
        }

        return transactionInstances.filter((transactionInstance: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
        {
            transactionInstance.transactions = transactionInstance.transactions.filter((transaction: FinancialPlanning.Common.Transactions.ITransaction) =>
            {
                if (startDate || endDate)
                {
                    let transactionMoment = moment(transaction.transactionDate);

                    if (startMoment && endMoment)
                    {
                        return transactionMoment.isBetween(startMoment, endMoment, "day");
                    }
                    else if (startMoment)
                    {
                        return transactionMoment.isAfter(startMoment, "day");
                    }
                    else if (endMoment)
                    {
                        return transactionMoment.isBefore(endMoment, "day")
                    }
                    else
                    {
                        return true
                    }
                }
            });

            return transactionInstance.transactions.length > 0;
        });
    }

    /**
     * Populate unprocessed transactions on a new recurring transaction instance to bring it up to date
     * @param fromDate
     * @returns {Array<FinancialPlanning.Common.Transactions.ITransaction>}
     */
    public static createTransactionsForNewRecurringInstance(fromDate: Date): Array<FinancialPlanning.Common.Transactions.ITransaction>
    {
        if (!ObjectUtilities.isDefined(fromDate))
        {
            throw new Error("No 'fromDate' parameter provided in TransactionUtilities::createTransactionsForNewRecurringInstance().");
        }

        let transactions: Array<FinancialPlanning.Common.Transactions.ITransaction> = [];

        if (!ObjectUtilities.isDefined(fromDate))
        {
            return transactions;
        }

        let startMoment = moment(fromDate);
        let endMoment = moment();
        let range = moment.range(startMoment, endMoment);
        range.by("months", (moment) =>
        {
            let transaction: FinancialPlanning.Common.Transactions.ITransaction = {
                _id: UuidUtilities.createNewMongodbId(),
                processed: false,
                transactionDate: moment.toDate()
            };

            transactions.push(transaction);
        });

        // We must have at least one transaction
        if (transactions.length === 0)
        {
            let transaction: FinancialPlanning.Common.Transactions.ITransaction = {
                _id: UuidUtilities.createNewMongodbId(),
                processed: false,
                transactionDate: fromDate
            };

            transactions.push(transaction)
        }

        return transactions;
    }

    /**
     * Create unprocessed transactions on a recurring transaction instance to bring it up to date
     * @param transactionInstance
     * @param end
     * @returns {FinancialPlanning.Common.Transactions.IRecurringTransactionInstance}
     */
    public static bringRecurringTransactionUpToDate(transactionInstance: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance, end?: Date): FinancialPlanning.Common.Transactions.IRecurringTransactionInstance
    {
        if (!ObjectUtilities.isDefined(transactionInstance))
        {
            throw new Error("No 'transactionInstance' parameter provided in TransactionUtilities::bringRecurringTransactionUpToDate().");
        }

        if (!transactionInstance.isActive)
        {
            return transactionInstance;
        }

        let transactions: Array<FinancialPlanning.Common.Transactions.ITransaction> = transactionInstance.transactions;

        if (transactions.length === 0)
        {
            throw new Error("Could not bring transactionInstance '" + transactionInstance._id + "' up to date. Fatal error encountered.");
        }

        let index: number = transactions.length - 1;
        let transaction: FinancialPlanning.Common.Transactions.ITransaction;

        while (index >= 0)
        {
            let current = transactions[index];

            if (current.processed)
            {
                transaction = current;
                break;
            }

            index--;
        }

        if (!transaction)
        {
            return transactionInstance;
        }

        let startMoment = moment(transaction.transactionDate).add(1, "months");
        let endMoment = end ? moment(end) : moment();
        let range = moment.range(startMoment, endMoment);

        range.by("months", (moment) =>
        {
            let transaction: FinancialPlanning.Common.Transactions.ITransaction = {
                _id: UuidUtilities.createNewMongodbId(),
                processed: false,
                transactionDate: moment.toDate()
            };

            transactionInstance.transactions.push(transaction);
        });

        return transactionInstance;
    }

    /**
     * Create transaction summaries from a transaction instance
     * @param transactionInstance
     * @param transactionTypeDal
     * @returns {Promise}
     */
    public static createTransactionSummaries(transactionInstance: FinancialPlanning.Common.Transactions.ITransactionInstance, transactionTypeDal: FinancialPlanning.Server.Database.ITransactionTypeDal, userId?: string): Promise<Array<FinancialPlanning.Common.Transactions.ITransactionSummary>>
    {
        return new Promise((resolve, reject) =>
        {
            let summaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary> = [];

            transactionTypeDal.getTransactionType(transactionInstance.transactionTypeId, userId)
                .then((transactionType: FinancialPlanning.Common.Transactions.ITransactionType) =>
                {
                    transactionInstance.transactions.forEach((transaction: FinancialPlanning.Common.Transactions.ITransaction) =>
                    {
                        let summary: FinancialPlanning.Common.Transactions.ITransactionSummary = {
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
    }

    /**
     * Create balance summaries from an array of transactions
     * @param transactions
     * @param startDate
     * @param endDate
     * @param currentBalance
     * @returns {FinancialPlanning.Common.Users.IBalanceSummary[]}
     */
    public static createBalanceSummary(transactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>, startDate: Date, endDate: Date, currentBalance: number): Array<FinancialPlanning.Common.Users.IBalanceSummary>
    {
        let dates = [];
        let dateSummaries: Array<FinancialPlanning.Common.Users.IBalanceSummary> = [];
        let balance = currentBalance;
        let startMoment = moment(startDate);
        let endMoment = moment(endDate);
        let range = moment.range(startMoment, endMoment);
        let adjustments = TransactionUtilities.createAdjustmentSummary(transactions);

        range.by("days", (moment) =>
        {
            dates.push(moment.toDate());
        });

        let newBalance: number = balance;

        while (dates.length > 0)
        {
            let date = dates.pop();
            let match: Array<FinancialPlanning.Server.Transactions.IAdjustmentSummary> = _.where(adjustments, {date: moment(date).format("YYYY-MM-DD")});
            if (match)
            {
                match.forEach((adjustment: FinancialPlanning.Server.Transactions.IAdjustmentSummary) =>
                {
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
    }

    /**
     * Create adjustment summaries from an array of transactions
     * @param transactions
     */
    public static createAdjustmentSummary(transactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>): Array<FinancialPlanning.Server.Transactions.IAdjustmentSummary>
    {
        let summaries: Array<FinancialPlanning.Server.Transactions.IAdjustmentSummary> = [];

        transactions.forEach((transactionInstance: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
        {
            transactionInstance.transactions.forEach((transaction: FinancialPlanning.Common.Transactions.ITransaction) =>
            {
                summaries.push({
                    date: moment(transaction.transactionDate).format("YYYY-MM-DD"),
                    adjustment: transactionInstance.adjustment
                });
            });
        });

        return summaries;
    }

    /**
     * Filter out incoming transactions
     * @param transactionInstances
     * @returns {FinancialPlanning.Common.Transactions.ITransactionInstance[]}
     */
    public static removeIncomingTransactions(transactionInstances: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>): Array<FinancialPlanning.Common.Transactions.ITransactionInstance>
    {
        return transactionInstances.filter((transactionInstance: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
        {
            return Math.abs(transactionInstance.adjustment) !== transactionInstance.adjustment;
        });
    }

    /**
     * Filter out outgoing transactions
     * @param transactionInstances
     * @returns {FinancialPlanning.Common.Transactions.ITransactionInstance[]}
     */
    public static removeOutgoingTransactions(transactionInstances: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>): Array<FinancialPlanning.Common.Transactions.ITransactionInstance>
    {
        return transactionInstances.filter((transactionInstance: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
        {
            return Math.abs(transactionInstance.adjustment) === transactionInstance.adjustment;
        });
    }

    /**
     * Create a balance forecast from current recurring transactions
     * @param recurringTransactions
     * @param balance
     * @returns {Array<FinancialPlanning.Common.Users.IBalanceSummary>}
     */
    public static createBalanceForecast(recurringTransactions: Array<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>,
                                        balance: number): Array<FinancialPlanning.Common.Users.IBalanceSummary>
    {
        let summaries: Array<FinancialPlanning.Common.Users.IBalanceSummary> = [];
        let futureTransactionInstances = recurringTransactions
            .map(x => TransactionUtilities.bringRecurringTransactionUpToDate(x, moment().add(3, "months").toDate()));
        let futureTransactions: Array<FinancialPlanning.Server.Transactions.IAdjustmentSummary> = [];
        futureTransactionInstances.forEach((transactionInstance: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance) =>
        {
            transactionInstance.transactions.forEach((transaction: FinancialPlanning.Common.Transactions.ITransaction) =>
            {
                if (!transaction.processed)
                {
                    futureTransactions.push({
                        date: moment(transaction.transactionDate).format("YYYY-MM-DD"),
                        adjustment: transactionInstance.adjustment
                    });
                }
            });
        });
        let start = moment();
        let end = moment().add(3, "months");
        var previousMoment = moment();
        let range = moment.range(start, end);
        range.by("weeks", (cMoment) =>
        {
            futureTransactions.forEach((fTransaction: FinancialPlanning.Server.Transactions.IAdjustmentSummary) =>
            {
                let transactionMoment = moment(new Date(fTransaction.date));
                if (transactionMoment.isBetween(previousMoment, cMoment))
                {
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
    }

    /**
     * Create totals for the given transactions filtered by month
     * @param transactions
     * @returns {Array<FinancialPlanning.Common.Transactions.IMonthTotal>}
     */
    public static totalTransactionsByMonth(transactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>): Array<FinancialPlanning.Common.Transactions.IMonthTotal>
    {
        let totals: Array<FinancialPlanning.Common.Transactions.IMonthTotal> = [];
        let now = moment().add(1, "months");
        let then = moment().add(1, "months").subtract(1, "years");
        let range = moment.range(then, now);
        range.by("months", (cMoment) =>
        {
            // create a range for the whole month
            let monthStart = cMoment.clone().startOf("month");
            let monthEnd = cMoment.clone().endOf("month");
            let transactionsForMonth: Array<number> = [];
            transactions.forEach((transactionInstance: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
            {
                transactionInstance.transactions.forEach((transaction: FinancialPlanning.Common.Transactions.ITransaction) =>
                {
                    if (moment(transaction.transactionDate).isBetween(monthStart, monthEnd))
                    {
                        transactionsForMonth.push(Math.abs(transactionInstance.adjustment));
                    }
                });
            });
            let total = 0;
            transactionsForMonth.forEach(x => total += x);
            totals.push({month: cMoment.format("MMM"), total: total});
        }, true);
        return totals;
    }
}

export = TransactionUtilities;
