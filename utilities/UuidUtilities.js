/// <reference path="../typings/tsd.d.ts" />
var mongodb = require("mongodb");
/**
 * Utility class for dealing with unique ID's
 */
var UuidUtilities = (function () {
    function UuidUtilities() {
    }
    /**
     * Create and return a new MongoDB ObjectID
     * @returns {"mongodb".ObjectID}
     */
    UuidUtilities.createNewMongodbId = function () {
        return new mongodb.ObjectID();
    };
    return UuidUtilities;
})();
module.exports = UuidUtilities;
//# sourceMappingURL=UuidUtilities.js.map