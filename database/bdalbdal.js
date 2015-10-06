/// <reference path="../typings/tsd.d.ts" />
/**
 * The abstract base class which the database class should extend
 */
var BaseDal = (function () {
    function BaseDal(dataStore, collectionName) {
        this._dataStore = dataStore;
        this._collectionName = collectionName;
    }
    /**
     * Return the reference to the datastore
     * @returns {FinancialPlanning.Server.Database.IDatabase}
     */
    BaseDal.prototype.getDataStore = function () {
        return this._dataStore;
    };
    /**
     * Return the reference to the collection name
     * @returns {string}
     */
    BaseDal.prototype.getCollectionName = function () {
        return this._collectionName;
    };
    return BaseDal;
})();
module.exports = BaseDal;
//# sourceMappingURL=BaseDal.js.map