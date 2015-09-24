import ObjectUtilities = require("./ObjectUtilities");

class CollectionUtilities
{
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