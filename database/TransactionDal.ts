/// <reference path="../typings/tsd.d.ts" />

import es6promise = require("es6-promise");
import mongodb = require("mongodb");

import BaseDal = require("./BaseDal");
import CollectionUtilities = require("../utilities/CollectionUtilities");
import ObjectUtilities = require("../utilities/ObjectUtilities");
import TransactionUtilities = require("../utilities/TransactionUtilities");

var Promise = es6promise.Promise;

/**
 * Class that provides methods to interact with the transaction MongoDB collection
 */
class TransactionDal extends BaseDal
{
    constructor(dataStore: FinancialPlanning.Server.Database.IDatabase, collectionName: string = "Transactions")
    {
        super(dataStore, collectionName);
    }

    /**
     * Get the transaction with the specified ID
     * @param transactionId
     * @returns {*}
     */
    public getTransaction(transactionId: string): Promise<FinancialPlanning.Common.Transactions.ITransactionInstance>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transactionId, true))
            {
                return reject(new Error("No 'transactionId' parameter provided in TransactionDal::getTransaction()."));
            }

            this.getDataStore().readObject(this.getCollectionName(), {"_id": new mongodb.ObjectID(transactionId)}, {})
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Get all transactions that belong to the specified user
     * @param userId
     * @returns {*}
     */
    public getTransactionsForUser(userId: string): Promise<Array<FinancialPlanning.Common.Transactions.ITransactionInstance>>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(userId, true))
            {
                return reject(new Error("No 'userId' parameter provided in TransactionDal::getTransactionsForUser()."));
            }

            this.getDataStore().readCollection(this.getCollectionName(), {"userId": userId}, {})
                .then((transactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>) =>
                {
                    return resolve(transactions);
                })
                .catch(reject);
        });
    }

    /**
     * Create a new transaction using the data provided
     * @param transaction
     * @returns {Promise<any>}
     */
    public createTransaction(transaction: FinancialPlanning.Common.Transactions.ITransactionInstance): Promise<FinancialPlanning.Common.Transactions.ITransactionInstance>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transaction))
            {
                return reject(new Error("No 'transaction' parameter provided in TransactionDal::createTransaction()."));
            }

            this.getDataStore().writeObject(this.getCollectionName(), transaction)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Delete all transactions that belong to a specified user
     * @param userId
     * @returns {Promise<boolean>}
     */
    public deleteTransactionsForUser(userId: string): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(userId, true))
            {
                return reject(new Error("No 'userId' parameter provided in TransactionDal::deleteTransactionsForUser()."));
            }

            this.getDataStore().deleteMultipleObjects(this.getCollectionName(), {"userId": userId})
                .then((response: boolean) =>
                {
                    if (response)
                    {
                        return resolve(true);
                    }
                    else
                    {
                        return reject(new Error("Could not delete"));
                    }
                })
                .catch((error: any) =>
                {
                    return reject(error)
                });
        });
    }

    /**
     * Update a transaction using the specified data
     * @param transactionId
     * @param transactionData
     * @returns {*}
     */
    public updateTransaction(transactionId: string, transactionData: FinancialPlanning.Common.Transactions.ITransactionInstance): Promise<FinancialPlanning.Common.Transactions.ITransactionInstance>
    {
        return new Promise((resolve, reject) =>
        {
            this.getDataStore().updateObject(this.getCollectionName(), {"_id": new mongodb.ObjectID(transactionId)}, transactionData)
                .then((response: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
                {
                    return resolve(response)
                })
                .catch((error: any) =>
                {
                    return reject(error);
                });
        })
    }

    /**
     * Change the status of a recurring transaction to be active or not, based on its current state
     * @param transactionInstanceId
     * @returns {*}
     */
    public toggleRecurringTransactionInstanceStatus(transactionInstanceId: string): Promise<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transactionInstanceId, true))
            {
                return reject(new Error("No 'transactionId' parameter provided in TransactionDal::toggleRecurringTransactionStatus()."));
            }

            this.getTransaction(transactionInstanceId)
                .then((transaction: FinancialPlanning.Common.Transactions.ITransactionInstance) =>
                {
                    var recurringTransaction = <FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>transaction;
                    if (!recurringTransaction.startDate)
                    {
                        return reject(new Error("Supplied transaction ID is not a recurring transaction"));
                    }

                    recurringTransaction.isActive = recurringTransaction.isActive !== true;

                    this.getDataStore().updateObject(this.getCollectionName(), {"_id": new mongodb.ObjectID(transactionInstanceId)}, recurringTransaction)
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }
}

export = TransactionDal;