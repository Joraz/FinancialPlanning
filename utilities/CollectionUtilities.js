var ObjectUtilities = require("./ObjectUtilities");
/**
 * Contains utility methods for dealing with collections
 */
var CollectionUtilities = (function () {
    function CollectionUtilities() {
    }
    /**
     * Transform the given object into an array
     * @param x
     * @returns {any}
     */
    CollectionUtilities.asArray = function (x) {
        if (!ObjectUtilities.isDefined(x)) {
            return [];
        }
        return [].concat.apply([], [x]);
    };
    return CollectionUtilities;
})();
module.exports = CollectionUtilities;
//# sourceMappingURL=CollectionUtilities.js.map