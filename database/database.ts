/// <reference path="../typings/tsd.d.ts" />

import es6promise = require("es6-promise");
import mongodb = require("mongodb");

var mongoClient = mongodb.MongoClient;
var Promise = es6promise.Promise;

/**
 * A class to control interactions with the mongodb client. Provides CRUD methods which return es6 promises
 */
class Database implements FinancialPlanning.Server.Database.IDatabase
{
    private _connectionString: string;
    private _db: mongodb.Db;

    constructor(databaseName?: string)
    {
        var serverName = "localhost";
        var port = 27017;
        databaseName = databaseName || "financial-planning";
        this._connectionString = "mongodb://" + serverName + ":" + port + "/" + databaseName;
    }

    /**
     *
     * @param collectionName
     * @param match
     * @param fields
     * @returns {*}
     */
    public readObject(collectionName: string, match: any, fields: any): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this.getCollection(collectionName)
                .then((collection: mongodb.Collection) =>
                {
                    collection.findOne(match, fields, (error: Error, result: any) =>
                    {
                        if (error)
                        {
                            return reject(error);
                        }

                        if (!result)
                        {
                            return reject(new Error("No item found using match: " + JSON.stringify(match)));
                        }

                        return resolve(result);
                    })
                })
                .catch((error: any) =>
                {
                    return reject(error);
                });
        });
    }

    /**
     *
     * @param collectionName
     * @param match
     * @param fields
     * @returns {*}
     */
    public readCollection(collectionName: string, match: any, fields: any): Promise<Array<any>>
    {
        return new Promise((resolve, reject) =>
        {
            this.getCollection(collectionName)
                .then((collection: mongodb.Collection) =>
                {
                    collection.find(match, fields)
                        .toArray((error: Error, results: Array<any>) =>
                        {
                            if (error)
                            {
                                return reject(error);
                            }

                            if (!results)
                            {
                                return reject(new Error("No items found using match: ") + JSON.stringify(match));
                            }

                            return resolve(results);
                        });
                })
                .catch((error: any) =>
                {
                    return reject(error);
                });
        });
    }

    /**
     *
     * @param collectionName
     * @param data
     * @returns {*}
     */
    public writeObject(collectionName: string, data: any): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this.getCollection(collectionName)
                .then((collection: mongodb.Collection) =>
                {
                    collection.insertOne(data, (error: Error, result: any) =>
                    {
                        if (error)
                        {
                            return reject(error);
                        }

                        var insertionResult = result.result;
                        var ops = result.ops;
                        //check the result
                        if (insertionResult && insertionResult.n && insertionResult.n > 0)
                        {
                            return resolve(ops[0]);
                        }
                        else
                        {
                            return reject(new Error("Could not insert item"));
                        }
                    });
                })
                .catch((error: any) =>
                {
                    return reject(error);
                });
        });
    }

    public writeMultipleObjects(collectionName: string, data: Array<any>): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this.getCollection(collectionName)
                .then((collection: mongodb.Collection) =>
                {
                    collection.insertMany(data, (error: Error, result: any) =>
                    {
                        if (error)
                        {
                            return reject(error);
                        }

                        var insertionResult = result.result;
                        var ops = result.ops;
                        //check the result
                        if (insertionResult && insertionResult.n && insertionResult.n > 0)
                        {
                            return resolve(ops);
                        }
                        else
                        {
                            return reject(new Error("Could not insert items"));
                        }
                    });
                })
                .catch((error: any) =>
                {
                    return reject(error);
                });
        });
    }

    /**
     *
     * @param collectionName
     * @param match
     * @param data
     * @returns {*}
     */
    public updateObject(collectionName: string, match: any, data: any): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this.getCollection(collectionName)
                .then((collection: mongodb.Collection) =>
                {
                    collection.findOneAndUpdate(match, data, {returnOriginal: false}, (error: Error, result: any) =>
                    {
                        if (error)
                        {
                            return reject(error);
                        }

                        if (!result.value)
                        {
                            return reject(new Error("No item found using match: " + JSON.stringify(match)));
                        }

                        return resolve(result.value);
                    })
                })
                .catch((error: any) =>
                {
                    return reject(error);
                });
        });
    }

    /**
     *
     * @param collectionName
     * @param match
     * @returns {*}
     */
    public deleteObject(collectionName: string, match: any): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            this.getCollection(collectionName)
                .then((collection: mongodb.Collection) =>
                {
                    collection.deleteOne(match, (error: Error, result: any) =>
                    {
                        if (error)
                        {
                            return reject(error);
                        }

                        var result = result.result;
                        //check the result
                        if (result && result.n && result.n > 0)
                        {
                            return resolve(true);
                        }
                        else
                        {
                            return reject();
                        }
                    });
                })
                .catch((error: any) =>
                {
                    return reject(error);
                });
        });
    }

    public deleteMultipleObjects(collectionName: string, match: any): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this.getCollection(collectionName)
                .then((collection: mongodb.Collection) =>
                {
                    collection.deleteMany(match, (error: Error, result: any) =>
                    {
                        if (error)
                        {
                            return reject(error);
                        }

                        var result = result.result;
                        //check the result
                        if (result && result.n && result.n > 0)
                        {
                            return resolve(true);
                        }
                        else
                        {
                            return reject();
                        }
                    });
                })
                .catch((error: any) =>
                {
                    return reject(error);
                });
        });
    }

    /**
     *
     * @param collectionName
     * @returns {*}
     */
    public deleteCollection(collectionName: string): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this.getDb()
                .then((db: mongodb.Db) =>
                {
                    db.dropCollection(collectionName, (error: Error, result: any) =>
                    {
                        if (error)
                        {
                            return reject(error);
                        }

                        return resolve(result);
                    });
                });
        });
    }

    /**
     *
     */
    public close(): void
    {
        if (this._db)
        {
            this._db.close();
        }
    }

    /**
     *
     * @returns {*}
     */
    private getDb(): Promise<mongodb.Db>
    {
        return new Promise((resolve, reject) =>
        {
            if (this._db)
            {
                return resolve(this._db);
            }
            else
            {
                mongoClient.connect(this._connectionString, (err: Error, db: mongodb.Db) =>
                {
                    if (err)
                    {
                        return reject(err);
                    }

                    this._db = db;
                    return resolve(db);
                });
            }
        });
    }

    /**
     *
     * @param collectionName
     * @returns {*}
     */
    private getCollection(collectionName: string): Promise<mongodb.Collection>
    {
        return new Promise((resolve, reject) =>
        {
            this.getDb()
                .then((db: mongodb.Db) =>
                {
                    db.collection(collectionName, (err: Error, collection: mongodb.Collection) =>
                    {
                        if (err)
                        {
                            return reject(err);
                        }

                        return resolve(collection);
                    });
                });
        });
    }
}

export = Database;