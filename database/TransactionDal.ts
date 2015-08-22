/// <reference path="../typings/tsd.d.ts" />

import BaseDal = require("./BaseDal");
import IDatabase = require("../interfaces/database/IDatabase");

import es6promise = require("es6-promise");

var Promise = es6promise.Promise;

class TransactionDal extends BaseDal
{
    constructor(dataStore: IDatabase, collectionName: string = "Transactions")
    {
        super(dataStore, collectionName);
    }

    public getTransaction(transactionId: string): Promise<FinancialPlanning.Transactions.ITransaction>
    {
        return this.getDataStore().readObject(this.getCollectionName(), {"_id": transactionId}, {});
    }

    public getTransactionsForUser(userId: string, startDate?: string, endDate?: string): Promise<Array<FinancialPlanning.Transactions.ITransaction>>
    {
        return new Promise((resolve, reject) =>
        {
            this.getDataStore().readCollection(this.getCollectionName(), {"user": userId}, {})
                .then((transactions: Array<FinancialPlanning.Transactions.ITransaction>) =>
                {
                    if (!startDate && !endDate)
                    {
                        return resolve(transactions);
                    }
                    //TODO filter transactions by date
                })
                .catch(reject);
        });
    }

    public createTransaction(transaction: FinancialPlanning.Transactions.ITransaction): Promise<FinancialPlanning.Transactions.ITransaction>
    {
        return this.getDataStore().writeObject(this.getCollectionName(), transaction);
    }

    public deleteTransaction(transactionId: string): Promise<any>
    {
        return this.getDataStore().deleteObject(this.getCollectionName(), {"_id": transactionId});
    }
}

export = TransactionDal;