/// <reference path="../typings/tsd.d.ts" />

import mongodb = require("mongodb");

class UuidUtilities
{
    public static createNewMongodbId(): mongodb.ObjectID
    {
        return new mongodb.ObjectID();
    }
}

export = UuidUtilities;