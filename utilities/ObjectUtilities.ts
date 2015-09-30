/// <reference path="../typings/tsd.d.ts" />

/**
 * Utility class for dealing with Objects
 */
class ObjectUtilities
{
    /**
     * Check if an object is null, undefined or has length of 0
     * @param item
     * @param checkLength
     * @returns {boolean}
     */
    public static isDefined(item: any, checkLength: boolean = false): boolean
    {
        return !(item === undefined || item === null || (checkLength && item.length === 0));
    }

    /**
     * Check if a string value or boolean is true
     * @param value
     * @returns {boolean}
     */
    public static isTrue(value: string | boolean): boolean
    {
        if (value)
        {
            return value.toString().trim().toLowerCase() === "true"
        }

        return false;
    }
}

export = ObjectUtilities;