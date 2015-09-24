/// <reference path="../typings/tsd.d.ts" />

class BaseDal
{
    private _dataStore: FinancialPlanning.Server.Database.IDatabase;
    private _collectionName: string;

    constructor(dataStore: FinancialPlanning.Server.Database.IDatabase, collectionName: string)
    {
        this._dataStore = dataStore;
        this._collectionName = collectionName;
    }

    public getDataStore(): FinancialPlanning.Server.Database.IDatabase
    {
        return this._dataStore;
    }

    public getCollectionName(): string
    {
        return this._collectionName;
    }
}
export = BaseDal;