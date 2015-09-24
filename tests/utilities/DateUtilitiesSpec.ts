/// <reference path="../../typings/tsd.d.ts" />

import chai = require("chai");
import moment = require("moment");

import DateUtilities = require("../../utilities/DateUtilities");

describe("DateUtilities", () =>
{
    describe("isDue", () =>
    {
        describe("When given a null value", () =>
        {
            it("should throw an error", () =>
            {
                chai.expect(() =>
                {
                    var x = DateUtilities.isDue(null);
                }).to.throw("No 'dueDate' parameter provided in DateUtilities::isDue().");
            });
        });

        describe("When given a moment that has a day that is before the current moment's", () =>
        {
            it("should return true", () =>
            {
                var thenMoment = moment().subtract(4, 'days');
                var due = DateUtilities.isDue(thenMoment);
                chai.expect(due).to.be.true;
            });
        });

        describe("When given a moment that has a day that is the same as the current moment's", () =>
        {
            describe("When the time is before the current moment", () =>
            {
                it("should return true", () =>
                {
                    var nowMoment = moment().subtract(2, 'hours');
                    var due = DateUtilities.isDue(nowMoment);
                    chai.expect(due).to.be.true;
                });
            });

            describe("When the time is after the current moment", () =>
            {
                it("should return true, because our precision is in days, not time", () =>
                {
                    var nowMoment = moment().add(2, 'hours');
                    var due = DateUtilities.isDue(nowMoment);
                    chai.expect(due).to.be.true;
                });
            });
        });

        describe("When given a moment that has a day that is after the current moment's", () =>
        {
            it("should return false", () =>
            {
                var futureMoment = moment().add(1, 'days');
                var due = DateUtilities.isDue(futureMoment);
                chai.expect(due).to.be.false;
            });
        });
    });

    describe("isBeforeOrEqual", () =>
    {
        describe("When a null 'firstDate' parameter is provided", () =>
        {
            it("should throw an error", () =>
            {
                chai.expect(() =>
                {
                    var x = DateUtilities.isBeforeOrEqual(null, null);
                }).to.throw("No 'firstDate' parameter provided in DateUtilities::isBeforeOrEqual().");
            });
        });

        describe("When a null 'secondDate' parameter is provided", () =>
        {
            it("should throw an error", () =>
            {
                chai.expect(() =>
                {
                    var x = DateUtilities.isBeforeOrEqual(new Date(2015, 0, 1), null);
                }).to.throw("No 'secondDate' parameter provided in DateUtilities::isBeforeOrEqual().");
            });
        });

        describe("When the the first date is before the second date with a granularity of days", () =>
        {
            it("should return true", () =>
            {
                var x = DateUtilities.isBeforeOrEqual(new Date(2015, 0, 1), new Date(2015, 0, 5));
                chai.expect(x).to.be.true;
            });
        });

        describe("When the the first date is before the second date with a granularity of less than days", () =>
        {
            it("should return true", () =>
            {
                var x = DateUtilities.isBeforeOrEqual(new Date(2015, 0, 1, 10), new Date(2015, 0, 1, 11));
                chai.expect(x).to.be.true;
            });
        });

        describe("When the first date is the same as the second date with a granularity of days", () =>
        {
            it("should return true", () =>
            {
                var x = DateUtilities.isBeforeOrEqual(new Date(2015, 0, 1), new Date(2015, 0, 1));
                chai.expect(x).to.be.true;
            });
        });

        describe("When the first date is the same as the second date with a granularity of less than days", () =>
        {
            it("should return true", () =>
            {
                var x = DateUtilities.isBeforeOrEqual(new Date(2015, 0, 1, 10), new Date(2015, 0, 1, 10));
                chai.expect(x).to.be.true;
            });
        });

        describe("When the first date is after the second date with a granularity of days", () =>
        {
            it("should return false", () =>
            {
                var x = DateUtilities.isBeforeOrEqual(new Date(2015, 0, 2), new Date(2015, 0, 1));
                chai.expect(x).to.be.false;
            });
        });

        describe("When the first date is after the second date with a granularity of less than days", () =>
        {
            it("should return true", () =>
            {
                var x = DateUtilities.isBeforeOrEqual(new Date(2015, 0, 1, 10), new Date(2015, 0, 1, 9));
                chai.expect(x).to.be.true;
            });
        });
    });
});