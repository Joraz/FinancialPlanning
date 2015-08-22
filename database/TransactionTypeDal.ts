/// <reference path="../typings/tsd.d.ts" />

import BaseDal = require("./BaseDal");
import IDatabase = require("../interfaces/database/IDatabase");

import es6promise = require("es6-promise");

var Promise = es6promise.Promise;

class TransactionTypeDal extends BaseDal
{
    constructor(dataStore: IDatabase, collectionName: string = "TransactionTypes")
    {
        super(dataStore, collectionName);
    }

    getTransactionType(transactionTypeId: string, userId?: string): Promise<FinancialPlanning.Transactions.ITransactionType>
    {
        var match = {
            "_id": transactionTypeId
        };

        if (userId && userId.trim().length > 0)
        {
            match["user"] = userId;
        }

        return this.getDataStore().readObject(this.getCollectionName(), match, {});
    }

    getAllTransactionTypes(userId?: string): Promise<Array<FinancialPlanning.Transactions.ITransactionType>>
    {
        return new Promise((resolve, reject) =>
        {
            this.getDataStore().readCollection(this.getCollectionName(), {}, {})
                .then((transactionTypes: Array<FinancialPlanning.Transactions.ITransactionType>) =>
                {
                    // TODO filter out transactionTypes belonging to specific users that are not provided as an argument
                })
                .catch(reject);
        });
    }

    createNewTransactionType(transactionType: FinancialPlanning.Transactions.ITransactionType): Promise<FinancialPlanning.Transactions.ITransactionType>
    {
        return this.getDataStore().writeObject(this.getCollectionName(), transactionType);
    }

    deleteTransactionType(transactionTypeId: string): Promise<any>
    {
        return this.getDataStore().deleteObject(this.getCollectionName(), {"_id": transactionTypeId});
    }
}

export = TransactionTypeDal;