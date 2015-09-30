import ObjectUtilities = require("./ObjectUtilities");

/**
 * Contains utility methods for dealing with collections
 */
class CollectionUtilities
{
    /**
     * Transform the given object into an array
     * @param x
     * @returns {any}
     */
    public static asArray(x: any): Array<any>
    {
        if (!ObjectUtilities.isDefined(x))
        {
            return [];
        }

        return [].concat.apply([], [x]);
    }
}

export = CollectionUtilities;