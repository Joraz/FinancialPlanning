/// <reference path="../../typings/tsd.d.ts" />

import chai = require("chai");

import ObjectUtilities = require("../../utilities/ObjectUtilities");

describe("ObjectUtilities", () =>
{
    describe("isDefined", () =>
    {
        describe("When item is null", () =>
        {
            describe("When checkLength is not specified", () =>
            {
                it("should return false", () =>
                {
                    var isDefined = ObjectUtilities.isDefined(null);
                    chai.expect(isDefined).to.be.false;
                });
            });

            describe("When checkLength is specified as false", () =>
            {
                it("should return false", () =>
                {
                    var isDefined = ObjectUtilities.isDefined(null, false);
                    chai.expect(isDefined).to.be.false;
                });
            });

            describe("When checkLength is specified as true", () =>
            {
                it("should return false", () =>
                {
                    var isDefined = ObjectUtilities.isDefined(null, true);
                    chai.expect(isDefined).to.be.false;
                });
            });
        });

        describe("When item is undefined", () =>
        {
            describe("When checkLength is not specified", () =>
            {
                it("should return false", () =>
                {
                    var isDefined = ObjectUtilities.isDefined(undefined);
                    chai.expect(isDefined).to.be.false;
                });
            });

            describe("When checkLength is specified as false", () =>
            {
                it("should return false", () =>
                {
                    var isDefined = ObjectUtilities.isDefined(undefined, false);
                    chai.expect(isDefined).to.be.false;
                });
            });

            describe("When checkLength is specified as true", () =>
            {
                it("should return false", () =>
                {
                    var isDefined = ObjectUtilities.isDefined(undefined, true);
                    chai.expect(isDefined).to.be.false;
                });
            });
        });

        describe("When item is an empty object", () =>
        {
            describe("When checkLength is not specified", () =>
            {
                it("should return true", () =>
                {
                    var isDefined = ObjectUtilities.isDefined({});
                    chai.expect(isDefined).to.be.true;
                });
            });

            describe("When checkLength is specified as false", () =>
            {
                it("should return true", () =>
                {
                    var isDefined = ObjectUtilities.isDefined({}, false);
                    chai.expect(isDefined).to.be.true;
                });
            });

            describe("When checkLength is specified as true", () =>
            {
                it("should return true", () =>
                {
                    var isDefined = ObjectUtilities.isDefined({}, true);
                    chai.expect(isDefined).to.be.true;
                });
            });
        });

        describe("When item is a string", () =>
        {
            describe("When an empty string is supplied", () =>
            {
                describe("When checkLength is not specified", () =>
                {
                    it("should return true", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined("");
                        chai.expect(isDefined).to.be.true;
                    });
                });

                describe("When checkLength is specified as false", () =>
                {
                    it("should return true", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined("", false);
                        chai.expect(isDefined).to.be.true;
                    });
                });

                describe("When checkLength is specified as true", () =>
                {
                    it("should return false", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined("", true);
                        chai.expect(isDefined).to.be.false;
                    });
                });
            });

            describe("When a string consisting of white space is supplied", ()=>
            {
                describe("When checkLength is not specified", () =>
                {
                    it("should return true", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined(" ");
                        chai.expect(isDefined).to.be.true;
                    });
                });

                describe("When checkLength is specified as false", () =>
                {
                    it("should return true", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined(" ", false);
                        chai.expect(isDefined).to.be.true;
                    });
                });

                describe("When checkLength is specified as true", () =>
                {
                    it("should return false", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined(" ", true);
                        chai.expect(isDefined).to.be.true;
                    });
                });
            });

            describe("When a string consisting of non-white space is supplied", ()=>
            {
                describe("When checkLength is not specified", () =>
                {
                    it("should return true", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined("abc");
                        chai.expect(isDefined).to.be.true;
                    });
                });

                describe("When checkLength is specified as false", () =>
                {
                    it("should return true", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined("abc", false);
                        chai.expect(isDefined).to.be.true;
                    });
                });

                describe("When checkLength is specified as true", () =>
                {
                    it("should return false", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined("abc", true);
                        chai.expect(isDefined).to.be.true;
                    });
                });
            });
        });

        describe("When item is an array", () =>
        {
            describe("When an empty array is supplied", () =>
            {
                describe("When checkLength is not specified", () =>
                {
                    it("should return true", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined([]);
                        chai.expect(isDefined).to.be.true;
                    });
                });

                describe("When checkLength is specified as false", () =>
                {
                    it("should return true", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined([], false);
                        chai.expect(isDefined).to.be.true;
                    });
                });

                describe("When checkLength is specified as true", () =>
                {
                    it("should return false", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined([], true);
                        chai.expect(isDefined).to.be.false;
                    });
                });
            });

            describe("When an array of at least one element is supplied", () =>
            {
                describe("When checkLength is not specified", () =>
                {
                    it("should return true", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined([123]);
                        chai.expect(isDefined).to.be.true;
                    });
                });

                describe("When checkLength is specified as false", () =>
                {
                    it("should return true", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined([123], false);
                        chai.expect(isDefined).to.be.true;
                    });
                });

                describe("When checkLength is specified as true", () =>
                {
                    it("should return true", () =>
                    {
                        var isDefined = ObjectUtilities.isDefined([123], true);
                        chai.expect(isDefined).to.be.true;
                    });
                });
            });
        });
    });

    describe("isTrue", () =>
    {
        describe("When called with null value", () =>
        {
            it("should return boolean false", () =>
            {
                var resultFlag = ObjectUtilities.isTrue(null);
                chai.expect(resultFlag).to.equal(false);
            });
        });

        describe("When called with empty string", () =>
        {
            it("should return boolean false", () =>
            {
                var checkString = "";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(false);
            });
        });

        describe("When called with string value true", () =>
        {
            it("should return boolean true", () =>
            {
                var checkString = "true";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(true);
            });
        });

        describe("When called with string value false", () =>
        {
            it("should return boolean false", () =>
            {
                var checkString = "false";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(false);
            });
        });

        describe("When called with string value false with capital letter", () =>
        {
            it("should return boolean false", () =>
            {
                var checkString = "FALSE";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(false);
            });
        });

        describe("When called with string value true with capital letter", () =>
        {
            it("should return boolean true", () =>
            {
                var checkString = "TRUE";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(true);
            });
        });

        describe("When called with boolean value true", () =>
        {
            it("should return boolean true", () =>
            {
                var checkString :  boolean = true;
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(true);
            });
        });

        describe("When called with boolean value false", () =>
        {
            it("should return boolean false", () =>
            {
                var checkString :  boolean = false;
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(false);
            });
        });

        describe("When called with string value false with spaces", () =>
        {
            it("should return boolean false", () =>
            {
                var checkString = " false  ";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(false);
            });
        });

        describe("When called with string value true with spaces", () =>
        {
            it("should return boolean true", () =>
            {
                var checkString = " true  ";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(true);
            });
        });
    });
});