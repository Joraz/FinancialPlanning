/// <reference path="../typings/tsd.d.ts" />

import moment = require("moment");
require("moment-range");
import _ = require("underscore");

import DateUtilities = require("./DateUtilities");
import ObjectUtilities = require("./ObjectUtilities");
import UuidUtilities = require("./UuidUtilities");

/**
 * Static utility class for creating and parsing transactions and transaction types
 */
class TransactionUtilities
{
    /**
     *
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
     *
     * @param transactionTypes
     * @param userId
     * @returns {FinancialPlanning.Common.Transactions.ITransactionType[]}
     */
    public static filterTransactionTypesByUser(transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>, userId?: string): Array<FinancialPlanning.Common.Transactions.ITransactionType>
    {
        //console.info("filterTransactionTypesByUser");
        //console.log(JSON.stringify(transactionTypes, null, 2));
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
     *
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
     *
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
     *
     * @param transactionInstance
     * @returns {FinancialPlanning.Common.Transactions.IRecurringTransactionInstance}
     */
    public static bringRecurringTransactionUpToDate(transactionInstance: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance): FinancialPlanning.Common.Transactions.IRecurringTransactionInstance
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

        let startMoment = moment(transaction.transactionDate).add(1, "month");
        let endMoment = moment();
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
     *
     * @param transactionInstance
     * @param transactionTypeDal
     * @returns {Promise}
     */
    public static createTransactionSummaries(transactionInstance: FinancialPlanning.Common.Transactions.ITransactionInstance, transactionTypeDal: FinancialPlanning.Server.Database.ITransactionTypeDal): Promise<Array<FinancialPlanning.Common.Transactions.ITransactionSummary>>
    {
        return new Promise((resolve, reject) =>
        {
            let summaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary> = [];

            transactionTypeDal.getTransactionType(transactionInstance.transactionTypeId)
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
}

export = TransactionUtilities;
