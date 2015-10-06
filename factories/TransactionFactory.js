/// <reference path="../typings/tsd.d.ts" />
var ObjectUtilities = require("../utilities/ObjectUtilities");
var TransactionUtilities = require("../utilities/TransactionUtilities");
var UuidUtilities = require("../utilities/UuidUtilities");
/**
 * Static class for creating transaction objects
 */
var TransactionFactory = (function () {
    function TransactionFactory() {
    }
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
    TransactionFactory.createNewTransactionType = function (name, paymentDirection, classification, userId, isTaxable, subClassification) {
        if (!ObjectUtilities.isDefined(name, true)) {
            throw new Error("No 'name' parameter provided in TransactionFactory::createNewTransactionType().");
        }
        if (!ObjectUtilities.isDefined(paymentDirection, true)) {
            throw new Error("No 'paymentDirection' parameter provided in TransactionFactory::createNewTransactionType().");
        }
        if (paymentDirection !== "incoming" && paymentDirection !== "outgoing") {
            throw new Error("Incorrect 'paymentDirection' parameter provided in TransactionFactory::createNewTransactionType().");
        }
        if (!ObjectUtilities.isDefined(classification, true)) {
            throw new Error("No 'classification' parameter provided in TransactionFactory::createNewTransactionType().");
        }
        if (!ObjectUtilities.isDefined(userId, true)) {
            throw new Error("No 'userId' parameter provided in TransactionFactory::createNewTransactionType().");
        }
        if (!ObjectUtilities.isDefined(isTaxable)) {
            throw new Error("No 'isTaxable' parameter provided in TransactionFactory::createNewTransactionType().");
        }
        var newTransactionType = {
            name: name,
            paymentDirection: paymentDirection,
            classification: classification,
            isDefault: false,
            userId: userId,
            isTaxable: isTaxable
        };
        if (ObjectUtilities.isDefined(subClassification, true)) {
            newTransactionType.subClassification = subClassification;
        }
        return newTransactionType;
    };
    /**
     * Create a new transaction instance from the given parameters
     * @param transactionTypeId
     * @param userId
     * @param date
     * @param adjustment
     * @returns {{transactionTypeId: string, userId: string, startDate: Date, adjustment: number, transactions: any[]}}
     */
    TransactionFactory.createNewTransactionInstance = function (transactionTypeId, userId, date, adjustment) {
        if (!ObjectUtilities.isDefined(transactionTypeId, true)) {
            throw new Error("No 'transactionTypeId' parameter provided in TransactionFactory::createNewTransactionInstance().");
        }
        if (!ObjectUtilities.isDefined(userId, true)) {
            throw new Error("No 'userId' parameter provided in TransactionFactory::createNewTransactionInstance().");
        }
        if (!ObjectUtilities.isDefined(date)) {
            throw new Error("No 'date' parameter provided in TransactionFactory::createNewTransactionInstance().");
        }
        if (!ObjectUtilities.isDefined(adjustment)) {
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
    };
    /**
     * Create a new recurring transaction instance using the given parameters
     * @param transactionTypeId
     * @param userId
     * @param date
     * @param adjustment
     * @returns {{transactionTypeId: string, userId: string, startDate: Date, adjustment: number, lastProcessedDate: null, isActive: boolean, transactions: Array<FinancialPlanning.Common.Transactions.ITransaction>}}
     */
    TransactionFactory.createNewRecurringTransactionInstance = function (transactionTypeId, userId, date, adjustment) {
        if (!ObjectUtilities.isDefined(transactionTypeId, true)) {
            throw new Error("No 'transactionTypeId' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
        }
        if (!ObjectUtilities.isDefined(userId, true)) {
            throw new Error("No 'userId' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
        }
        if (!ObjectUtilities.isDefined(date)) {
            throw new Error("No 'date' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
        }
        if (!ObjectUtilities.isDefined(adjustment)) {
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
    };
    return TransactionFactory;
})();
module.exports = TransactionFactory;
//# sourceMappingURL=TransactionFactory.js.map