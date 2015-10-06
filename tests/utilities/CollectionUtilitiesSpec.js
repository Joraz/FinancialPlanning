/// <reference path="../../typings/tsd.d.ts" />
var chai = require("chai");
var CollectionUtilities = require("../../utilities/CollectionUtilities");
describe("Collection Utilities Tests", function () {
    describe("asArray", function () {
        describe("When a null object is specified", function () {
            it("should return an empty array", function () {
                var resultArray = CollectionUtilities.asArray(null);
                chai.expect(resultArray).to.eql([]);
            });
        });
        describe("When an undefined object is specified", function () {
            it("should return an empty array", function () {
                var resultArray = CollectionUtilities.asArray(undefined);
                chai.expect(resultArray).to.eql([]);
            });
        });
        describe("When an empty string is specified", function () {
            it("should return an array with a single element which is an empty string", function () {
                var resultArray = CollectionUtilities.asArray("");
                chai.expect(resultArray).to.eql([""]);
            });
        });
        describe("When an empty object is specified", function () {
            it("should return an array with a single element which is an empty object", function () {
                var resultArray = CollectionUtilities.asArray({});
                chai.expect(resultArray).to.eql([{}]);
            });
        });
        describe("When a number is specified", function () {
            it("should return an array with a single element which is a number", function () {
                var resultArray = CollectionUtilities.asArray(123);
                chai.expect(resultArray).to.eql([123]);
            });
        });
        describe("When a boolean is specified", function () {
            it("should return an array with a single element which is a boolean", function () {
                var resultArray = CollectionUtilities.asArray(true);
                chai.expect(resultArray).to.eql([true]);
            });
        });
        describe("When a populated object is specified", function () {
            it("should return an array with a single element which is the populated object", function () {
                var obj = {
                    id: 123,
                    name: "testObj",
                    complex: {
                        prop1: true,
                        prop2: "hello"
                    }
                };
                var resultArray = CollectionUtilities.asArray(obj);
                chai.expect(resultArray).to.eql([{
                        id: 123,
                        name: "testObj",
                        complex: {
                            prop1: true,
                            prop2: "hello"
                        }
                    }]);
            });
        });
        describe("When an empty array is specified", function () {
            it("should return an empty array", function () {
                var resultArray = CollectionUtilities.asArray([]);
                chai.expect(resultArray).to.eql([]);
            });
        });
        describe("When an array with a single element is specified", function () {
            it("should return an the array untouched", function () {
                var resultArray = CollectionUtilities.asArray([123]);
                chai.expect(resultArray).to.eql([123]);
            });
        });
        describe("When an array with a multiple elements is specified", function () {
            it("should return an the array untouched", function () {
                var resultArray = CollectionUtilities.asArray([123, 246]);
                chai.expect(resultArray).to.eql([123, 246]);
            });
        });
    });
});
//# sourceMappingURL=CollectionUtilitiesSpec.js.map