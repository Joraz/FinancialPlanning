/**
 * Created by Daniel on 21/07/2015.
 */

/// <reference path="../../typings/tsd.d.ts" />

import es6promise = require("es6-promise");

var Promise = es6promise.Promise;

interface IDatabase
{
    readObject: (collectionName: string, match: any, fields: any) => Promise<any>;

    readCollection: (collectionName: string, match: any, fields: any) => Promise<Array<any>>;

    writeObject: (collectionName: string, data: any) => Promise<any>;

    updateObject: (collectionName: string, match: any, data: any) => Promise<any>;

    deleteObject: (collectionName: string, match: any) => Promise<any>;

    deleteCollection: (collectionName: string) => Promise<any>;

    close: () => void;
}

export = IDatabase;