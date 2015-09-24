/// <reference path="../typings/tsd.d.ts" />

class ObjectUtilities
{
    public static isDefined(item: any, checkLength: boolean = false): boolean
    {
        return !(item === undefined || item === null || (checkLength && item.length === 0));
    }

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