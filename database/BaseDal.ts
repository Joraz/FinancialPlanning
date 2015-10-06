/// <reference path="../typings/tsd.d.ts" />

/**
 * The abstract base class which the database class should extend
 */
class BaseDal
{
    /**
     * Holds a reference to the datastore instance object
     */
    private _dataStore: FinancialPlanning.Server.Database.IDatabase;
    /**
     * Holds a reference to the name of the collection in the datastore
     */
    private _collectionName: string;

    constructor(dataStore: FinancialPlanning.Server.Database.IDatabase, collectionName: string)
    {
        this._dataStore = dataStore;
        this._collectionName = collectionName;
    }

    /**
     * Return the reference to the datastore
     * @returns {FinancialPlanning.Server.Database.IDatabase}
     */
    public getDataStore(): FinancialPlanning.Server.Database.IDatabase
    {
        return this._dataStore;
    }

    /**
     * Return the reference to the collection name
     * @returns {string}
     */
    public getCollectionName(): string
    {
        return this._collectionName;
    }
}
export = BaseDal;