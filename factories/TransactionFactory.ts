/// <reference path="../typings/tsd.d.ts" />

import ObjectUtilities = require("../utilities/ObjectUtilities");
import TransactionUtilities = require("../utilities/TransactionUtilities");
import UuidUtilities = require("../utilities/UuidUtilities");

/**
 * Static class for creating transaction objects
 */
class TransactionFactory
{
    /**
     * Create a new transaction type object from the given parameters
     * @param name
     * @param paymentDirection
     * @param classification
     * @param userId
     * @param isTaxable
     * @param subClassification
     * @returns {FinancialPlanning.Common.Transactions.ITransactionType}
     */
    public static createNewTransactionType(name: string, paymentDirection: string, classification: string,
                                           userId: string, isTaxable: boolean, subClassification?: string): FinancialPlanning.Common.Transactions.ITransactionType
    {
        if (!ObjectUtilities.isDefined(name, true))
        {
            throw new Error("No 'name' parameter provided in TransactionFactory::createNewTransactionType().");
        }

        if (!ObjectUtilities.isDefined(paymentDirection, true))
        {
            throw new Error("No 'paymentDirection' parameter provided in TransactionFactory::createNewTransactionType().");
        }

        if (paymentDirection !== "incoming" && paymentDirection !== "outgoing")
        {
            throw new Error("Incorrect 'paymentDirection' parameter provided in TransactionFactory::createNewTransactionType().");
        }

        if (!ObjectUtilities.isDefined(classification, true))
        {
            throw new Error("No 'classification' parameter provided in TransactionFactory::createNewTransactionType().");
        }

        if (!ObjectUtilities.isDefined(userId, true))
        {
            throw new Error("No 'userId' parameter provided in TransactionFactory::createNewTransactionType().");
        }

        if (!ObjectUtilities.isDefined(isTaxable))
        {
            throw new Error("No 'isTaxable' parameter provided in TransactionFactory::createNewTransactionType().");
        }

        var newTransactionType: FinancialPlanning.Common.Transactions.ITransactionType = {
            name: name,
            paymentDirection: paymentDirection,
            classification: classification,
            isDefault: false,
            userId: userId,
            isTaxable: isTaxable
        };

        if (ObjectUtilities.isDefined(subClassification, true))
        {
            newTransactionType.subClassification = subClassification;
        }

        return newTransactionType;
    }

    /**
     * Create a new transaction instance from the given parameters
     * @param transactionTypeId
     * @param userId
     * @param date
     * @param adjustment
     * @returns {{transactionTypeId: string, userId: string, startDate: Date, adjustment: number, transactions: any[]}}
     */
    public static createNewTransactionInstance(transactionTypeId: string, userId: string, date: Date, adjustment: number): FinancialPlanning.Common.Transactions.ITransactionInstance
    {
        if (!ObjectUtilities.isDefined(transactionTypeId, true))
        {
            throw new Error("No 'transactionTypeId' parameter provided in TransactionFactory::createNewTransactionInstance().");
        }

        if (!ObjectUtilities.isDefined(userId, true))
        {
            throw new Error("No 'userId' parameter provided in TransactionFactory::createNewTransactionInstance().");
        }

        if (!ObjectUtilities.isDefined(date))
        {
            throw new Error("No 'date' parameter provided in TransactionFactory::createNewTransactionInstance().");
        }

        if (!ObjectUtilities.isDefined(adjustment))
        {
            throw new Error("No 'adjustment' parameter provided in TransactionFactory::createNewTransactionInstance().");
        }

        return {
            transactionTypeId: transactionTypeId,
            userId: userId,
            startDate: date,
            adjustment: adjustment,
            transactions: [
                {
                    _id: UuidUtilities.createNewMongodbId(),
                    transactionDate: date,
                    processed: false
                }
            ]
        };
    }

    /**
     * Create a new recurring transaction instance using the given parameters
     * @param transactionTypeId
     * @param userId
     * @param date
     * @param adjustment
     * @returns {{transactionTypeId: string, userId: string, startDate: Date, adjustment: number, lastProcessedDate: null, isActive: boolean, transactions: Array<FinancialPlanning.Common.Transactions.ITransaction>}}
     */
    public static createNewRecurringTransactionInstance(transactionTypeId: string, userId: string, date: Date, adjustment: number): FinancialPlanning.Common.Transactions.IRecurringTransactionInstance
    {
        if (!ObjectUtilities.isDefined(transactionTypeId, true))
        {
            throw new Error("No 'transactionTypeId' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
        }

        if (!ObjectUtilities.isDefined(userId, true))
        {
            throw new Error("No 'userId' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
        }

        if (!ObjectUtilities.isDefined(date))
        {
            throw new Error("No 'date' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
        }

        if (!ObjectUtilities.isDefined(adjustment))
        {
            throw new Error("No 'adjustment' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
        }

        return {
            transactionTypeId: transactionTypeId,
            userId: userId,
            startDate: date,
            adjustment: adjustment,
            lastProcessedDate: null,
            isActive: true,
            transactions: TransactionUtilities.createTransactionsForNewRecurringInstance(date)
        };
    }
}

export = TransactionFactory;