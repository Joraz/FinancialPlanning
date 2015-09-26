/// <reference path="../typings/tsd.d.ts" />

import es6promise = require("es6-promise");
import mongodb = require("mongodb");

import BaseDal = require("./BaseDal");
import CollectionUtilities = require("../utilities/CollectionUtilities");
import ObjectUtilities = require("../utilities/ObjectUtilities");
import TransactionUtilities = require("../utilities/TransactionUtilities");

var Promise = es6promise.Promise;

class TransactionDal extends BaseDal
{
    constructor(dataStore: FinancialPlanning.Server.Database.IDatabase, collectionName: string = "Transactions")
    {
        super(dataStore, collectionName);
    }

    /**
     *
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
     *
     * @param userId
     * @param startDate
     * @param endDate
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
     *
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
     *
     * @param userId
     * @returns {*}
     */
    public deleteTransactionsForUser(userId: string): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(userId, true))
            {
                return reject(new Error("No 'userId' parameter provided in TransactionDal::deleteTransaction()."));
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
     *
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