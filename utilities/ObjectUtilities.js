/// <reference path="../typings/tsd.d.ts" />
/**
 * Utility class for dealing with Objects
 */
var ObjectUtilities = (function () {
    function ObjectUtilities() {
    }
    /**
     * Check if an object is null, undefined or has length of 0
     * @param item
     * @param checkLength
     * @returns {boolean}
     */
    ObjectUtilities.isDefined = function (item, checkLength) {
        if (checkLength === void 0) { checkLength = false; }
        return !(item === undefined || item === null || (checkLength && item.length === 0));
    };
    /**
     * Check if a string value or boolean is true
     * @param value
     * @returns {boolean}
     */
    ObjectUtilities.isTrue = function (value) {
        if (value) {
            return value.toString().trim().toLowerCase() === "true";
        }
        return false;
    };
    return ObjectUtilities;
})();
module.exports = ObjectUtilities;
//# sourceMappingURL=ObjectUtilities.js.map