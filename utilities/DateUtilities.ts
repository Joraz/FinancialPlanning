/// <reference path="../typings/tsd.d.ts" />

import moment = require("moment");

import ObjectUtilities = require("./ObjectUtilities");

/**
 * Class containing utility methods for dealing with Dates
 */
class DateUtilities
{
    /**
     * Given a Moment, return a boolean based on whether or not the day of that moment is today or in the past
     * @param dueDate - the moment to check
     * @returns {boolean}
     */
    public static isDue(dueDate: moment.Moment): boolean
    {
        if (!ObjectUtilities.isDefined(dueDate))
        {
            throw new Error("No 'dueDate' parameter provided in DateUtilities::isDue().");
        }

        var now = moment();
        return (dueDate.isBefore(now, 'days') || dueDate.isSame(now, 'days'));
    }

    /**
     * Given two dates, return true if the first date is before or equal to the second date
     * @param firstDate
     * @param secondDate
     */
    public static isBeforeOrEqual(firstDate: Date, secondDate: Date): boolean
    {
        if (!ObjectUtilities.isDefined(firstDate))
        {
            throw new Error("No 'firstDate' parameter provided in DateUtilities::isBeforeOrEqual().");
        }

        if (!ObjectUtilities.isDefined(secondDate))
        {
            throw new Error("No 'secondDate' parameter provided in DateUtilities::isBeforeOrEqual().");
        }

        var startMoment = moment(firstDate);
        var endMoment = moment(secondDate);

        return (startMoment.isBefore(endMoment, 'days') || startMoment.isSame(endMoment, 'days'));
    }
}

export = DateUtilities;