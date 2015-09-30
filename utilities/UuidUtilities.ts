/// <reference path="../typings/tsd.d.ts" />

import mongodb = require("mongodb");

/**
 * Utility class for dealing with unique ID's
 */
class UuidUtilities
{
    /**
     * Create and return a new MongoDB ObjectID
     * @returns {"mongodb".ObjectID}
     */
    public static createNewMongodbId(): mongodb.ObjectID
    {
        return new mongodb.ObjectID();
    }
}

export = UuidUtilities;