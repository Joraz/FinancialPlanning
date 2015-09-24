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

            this.getDataStore().readObject(this.getCollectionName(), {"_id": transactionId}, {})
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
     * @param transactionId
     * @returns {Promise<any>}
     */
    public deleteTransaction(transactionId: string): Promise<string>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transactionId, true))
            {
                return reject(new Error("No 'transactionId' parameter provided in TransactionDal::deleteTransaction()."));
            }

            this.getDataStore().deleteObject(this.getCollectionName(), {"_id": transactionId})
                .then((response: boolean) =>
                {
                    if (response)
                    {
                        return resolve("Success");
                    }
                    else
                    {
                        return reject("Failure");
                    }
                })
                .catch((error: any) =>
                {
                    if (error)
                    {
                        return reject(error)
                    }
                    else
                    {
                        return reject(new Error("Could not delete transaction " + transactionId));
                    }
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

                    this.getDataStore().updateObject(this.getCollectionName(), {"_id": transactionInstanceId}, recurringTransaction)
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    /**
     *
     * @param transactionTypeId
     * @param userId
     * @returns {*}
     */
    public getTransactionType(transactionTypeId: string, userId?: string): Promise<FinancialPlanning.Common.Transactions.ITransactionType>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transactionTypeId, true))
            {
                return reject(new Error("No 'transactionTypeId' parameter provided in TransactionDal::getTransactionType()."));
            }

            // TODO need to turn into ObjectID and fix tests
            return this.getDataStore().readObject(this.getCollectionName(), {"_id": transactionTypeId}, {})
                .then((response: any) =>
                {
                    var filtered = TransactionUtilities.filterTransactionTypesByUser(CollectionUtilities.asArray(response), userId);

                    if (ObjectUtilities.isDefined(filtered, true))
                    {
                        return resolve(filtered[0])
                    }
                    else
                    {
                        return reject(new Error("No transaction type found"));
                    }
                })
                .catch(reject);
        });
    }

    /**
     *
     * @param userId
     * @returns {*}
     */
    public getAllTransactionTypes(userId?: string): Promise<Array<FinancialPlanning.Common.Transactions.ITransactionType>>
    {
        return new Promise((resolve, reject) =>
        {
            this.getDataStore().readCollection(this.getCollectionName(), {}, {})
                .then((transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>) =>
                {
                    var filtered = TransactionUtilities.filterTransactionTypesByUser(transactionTypes, userId);
                    return resolve(filtered);
                })
                .catch(reject);
        });
    }

    /**
     *
     * @param transactionType
     * @returns {*}
     */
    public createNewTransactionType(transactionType: FinancialPlanning.Common.Transactions.ITransactionType): Promise<FinancialPlanning.Common.Transactions.ITransactionType>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transactionType))
            {
                return reject(new Error("No 'transactionType' parameter provided in TransactionDal::createNewTransactionType()."));
            }

            this.getDataStore().writeObject(this.getCollectionName(), transactionType)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     *
     * @param transactionTypeId
     * @returns {any}
     */
    public deleteTransactionType(transactionTypeId: string): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transactionTypeId, true))
            {
                return reject(new Error("No 'transactionTypeId' parameter provided in TransactionDal::deleteTransactionType()."));
            }

            this.getDataStore().deleteObject(this.getCollectionName(), {"_id": transactionTypeId})
                .then((response: boolean) =>
                {
                    if (response)
                    {
                        return resolve("Success");
                    }
                    else
                    {
                        return reject("Failure");
                    }
                })
                .catch((error: any) =>
                {
                    if (error)
                    {
                        return reject(error)
                    }
                    else
                    {
                        return reject(new Error("Could not delete transaction type " + transactionTypeId));
                    }
                });
        });
    }

    /**
     *
     * @param transactionTypeId
     * @param paymentDirection
     * @param name
     * @param classification
     * @param subClassification
     * @returns {*}
     */
    public updateTransactionType(transactionTypeId: string,
                                 paymentDirection?: string,
                                 name?: string,
                                 classification?: string,
                                 subClassification?: string): Promise<FinancialPlanning.Common.Transactions.ITransactionType>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transactionTypeId, true))
            {
                return reject(new Error("No 'transactionTypeId' parameter provided in TransactionDal::updateTransactionType()."));
            }

            var updateObject: any = {
                $set: {}
            };

            if (ObjectUtilities.isDefined(paymentDirection, true))
            {
                if (paymentDirection === "incoming" || paymentDirection === "outgoing")
                {
                    updateObject.$set.paymentDirection = paymentDirection
                }
                else
                {
                    return reject(new Error("'paymentDirection' must be incoming or outgoing"));
                }
            }

            if (ObjectUtilities.isDefined(name, true))
            {
                updateObject.$set.name = name;
            }

            if (ObjectUtilities.isDefined(classification))
            {
                updateObject.$set.classification = classification;
            }

            if (ObjectUtilities.isDefined(subClassification))
            {
                updateObject.$set.subClassification = subClassification
            }

            if (_.isEmpty(updateObject.$set))
            {
                return reject(new Error("No updates specified in TransactionDal::updateTransactionType()."));
            }

            this.getDataStore().updateObject(this.getCollectionName(), {"_id": new mongodb.ObjectID(transactionTypeId)}, updateObject)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     *
     * @param transactionTypeId
     * @returns {*}
     */
    public checkTransactionTypeExists(transactionTypeId: string): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transactionTypeId, true))
            {
                return reject(new Error("No 'transactionTypeId' parameter provided in TransactionDal::checkTransactionTypeExists()."));
            }

            this.getDataStore().readObject(this.getCollectionName(), {"_id": new mongodb.ObjectID(transactionTypeId)}, {})
                .then(() =>
                {
                    return resolve(true);
                })
                .catch(() =>
                {
                    return resolve(false);
                });
        });
    }

    public createTransactionInstance(transactionInstance: FinancialPlanning.Common.Transactions.ITransactionInstance): Promise<FinancialPlanning.Common.Transactions.ITransactionInstance>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transactionInstance))
            {
                return reject(new Error("No 'transactionInstance' parameter provided in TransactionDal::createTransactionInstance()."));
            }

            this.getDataStore().writeObject(this.getCollectionName(), transactionInstance)
                .then(resolve)
                .catch(reject);
        });
    }
}

export = TransactionDal;