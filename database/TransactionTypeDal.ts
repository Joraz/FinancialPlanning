/// <reference path="../typings/tsd.d.ts" />

import es6promise = require("es6-promise");
import mongodb = require("mongodb");
import _ = require("underscore");

import BaseDal = require("./BaseDal");
import CollectionUtilities = require("../utilities/CollectionUtilities");
import ObjectUtilities = require("../utilities/ObjectUtilities");
import TransactionUtilities = require("../utilities/TransactionUtilities");

var Promise = es6promise.Promise;


class TransactionTypeDal extends BaseDal implements FinancialPlanning.Server.Database.ITransactionTypeDal
{
    constructor(dataStore: FinancialPlanning.Server.Database.IDatabase, collectionName: string = "TransactionTypes")
    {
        super(dataStore, collectionName);
    }

    /**
     *
     * @param transactionType
     * @returns {*}
     */
    public createTransactionType(transactionType: FinancialPlanning.Common.Transactions.ITransactionType): Promise<FinancialPlanning.Common.Transactions.ITransactionType>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transactionType))
            {
                return reject(new Error("No 'transactionType' parameter provided in TransactionTypeDal::createTransactionType()."));
            }

            this.getDataStore().writeObject(this.getCollectionName(), transactionType)
                .then(resolve)
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
                return reject(new Error("No 'transactionTypeId' parameter provided in TransactionTypeDal::getTransactionType()."));
            }

            return this.getDataStore().readObject(this.getCollectionName(), {"_id": new mongodb.ObjectID(transactionTypeId)}, {})
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
    public getAllTransactionTypesByUserId(userId: string): Promise<Array<FinancialPlanning.Common.Transactions.ITransactionType>>
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
     * @param transactionTypeId
     * @returns {any}
     */
    public deleteTransactionType(transactionTypeId: string): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transactionTypeId, true))
            {
                return reject(new Error("No 'transactionTypeId' parameter provided in TransactionTypeDal::deleteTransactionType()."));
            }

            this.getDataStore().deleteObject(this.getCollectionName(), {"_id": transactionTypeId})
                .then((response: boolean) =>
                {
                    if (response)
                    {
                        return resolve(true);
                    }
                    else
                    {
                        return resolve(false);
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
                                 name?: string,
                                 classification?: string,
                                 subClassification?: string): Promise<FinancialPlanning.Common.Transactions.ITransactionType>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(transactionTypeId, true))
            {
                return reject(new Error("No 'transactionTypeId' parameter provided in TransactionTypeDal::updateTransactionType()."));
            }

            var updateObject: any = {
                $set: {}
            };

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
                return reject(new Error("No updates specified in TransactionTypeDal::updateTransactionType()."));
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
                return reject(new Error("No 'transactionTypeId' parameter provided in TransactionTypeDal::checkTransactionTypeExists()."));
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

    /**
     *
     * @param userId
     * @returns {*}
     */
    public deleteAllTransactionTypesForUser(userId: string): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(userId, true))
            {
                return reject(new Error("No 'userId' parameter provided in TransactionTypeDal::deleteAllTransactionsForUser()."));
            }

            this.getDataStore().deleteMultipleObjects(this.getCollectionName(), {"userId": userId})
                .then((successful: boolean) =>
                {
                    return resolve(successful);
                })
                .catch((error) =>
                {
                    return reject(error);
                });
        });
    }
}

export = TransactionTypeDal;