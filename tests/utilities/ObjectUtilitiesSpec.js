/// <reference path="../../typings/tsd.d.ts" />
var chai = require("chai");
var ObjectUtilities = require("../../utilities/ObjectUtilities");
describe("ObjectUtilities", function () {
    describe("isDefined", function () {
        describe("When item is null", function () {
            describe("When checkLength is not specified", function () {
                it("should return false", function () {
                    var isDefined = ObjectUtilities.isDefined(null);
                    chai.expect(isDefined).to.be.false;
                });
            });
            describe("When checkLength is specified as false", function () {
                it("should return false", function () {
                    var isDefined = ObjectUtilities.isDefined(null, false);
                    chai.expect(isDefined).to.be.false;
                });
            });
            describe("When checkLength is specified as true", function () {
                it("should return false", function () {
                    var isDefined = ObjectUtilities.isDefined(null, true);
                    chai.expect(isDefined).to.be.false;
                });
            });
        });
        describe("When item is undefined", function () {
            describe("When checkLength is not specified", function () {
                it("should return false", function () {
                    var isDefined = ObjectUtilities.isDefined(undefined);
                    chai.expect(isDefined).to.be.false;
                });
            });
            describe("When checkLength is specified as false", function () {
                it("should return false", function () {
                    var isDefined = ObjectUtilities.isDefined(undefined, false);
                    chai.expect(isDefined).to.be.false;
                });
            });
            describe("When checkLength is specified as true", function () {
                it("should return false", function () {
                    var isDefined = ObjectUtilities.isDefined(undefined, true);
                    chai.expect(isDefined).to.be.false;
                });
            });
        });
        describe("When item is an empty object", function () {
            describe("When checkLength is not specified", function () {
                it("should return true", function () {
                    var isDefined = ObjectUtilities.isDefined({});
                    chai.expect(isDefined).to.be.true;
                });
            });
            describe("When checkLength is specified as false", function () {
                it("should return true", function () {
                    var isDefined = ObjectUtilities.isDefined({}, false);
                    chai.expect(isDefined).to.be.true;
                });
            });
            describe("When checkLength is specified as true", function () {
                it("should return true", function () {
                    var isDefined = ObjectUtilities.isDefined({}, true);
                    chai.expect(isDefined).to.be.true;
                });
            });
        });
        describe("When item is a string", function () {
            describe("When an empty string is supplied", function () {
                describe("When checkLength is not specified", function () {
                    it("should return true", function () {
                        var isDefined = ObjectUtilities.isDefined("");
                        chai.expect(isDefined).to.be.true;
                    });
                });
                describe("When checkLength is specified as false", function () {
                    it("should return true", function () {
                        var isDefined = ObjectUtilities.isDefined("", false);
                        chai.expect(isDefined).to.be.true;
                    });
                });
                describe("When checkLength is specified as true", function () {
                    it("should return false", function () {
                        var isDefined = ObjectUtilities.isDefined("", true);
                        chai.expect(isDefined).to.be.false;
                    });
                });
            });
            describe("When a string consisting of white space is supplied", function () {
                describe("When checkLength is not specified", function () {
                    it("should return true", function () {
                        var isDefined = ObjectUtilities.isDefined(" ");
                        chai.expect(isDefined).to.be.true;
                    });
                });
                describe("When checkLength is specified as false", function () {
                    it("should return true", function () {
                        var isDefined = ObjectUtilities.isDefined(" ", false);
                        chai.expect(isDefined).to.be.true;
                    });
                });
                describe("When checkLength is specified as true", function () {
                    it("should return false", function () {
                        var isDefined = ObjectUtilities.isDefined(" ", true);
                        chai.expect(isDefined).to.be.true;
                    });
                });
            });
            describe("When a string consisting of non-white space is supplied", function () {
                describe("When checkLength is not specified", function () {
                    it("should return true", function () {
                        var isDefined = ObjectUtilities.isDefined("abc");
                        chai.expect(isDefined).to.be.true;
                    });
                });
                describe("When checkLength is specified as false", function () {
                    it("should return true", function () {
                        var isDefined = ObjectUtilities.isDefined("abc", false);
                        chai.expect(isDefined).to.be.true;
                    });
                });
                describe("When checkLength is specified as true", function () {
                    it("should return false", function () {
                        var isDefined = ObjectUtilities.isDefined("abc", true);
                        chai.expect(isDefined).to.be.true;
                    });
                });
            });
        });
        describe("When item is an array", function () {
            describe("When an empty array is supplied", function () {
                describe("When checkLength is not specified", function () {
                    it("should return true", function () {
                        var isDefined = ObjectUtilities.isDefined([]);
                        chai.expect(isDefined).to.be.true;
                    });
                });
                describe("When checkLength is specified as false", function () {
                    it("should return true", function () {
                        var isDefined = ObjectUtilities.isDefined([], false);
                        chai.expect(isDefined).to.be.true;
                    });
                });
                describe("When checkLength is specified as true", function () {
                    it("should return false", function () {
                        var isDefined = ObjectUtilities.isDefined([], true);
                        chai.expect(isDefined).to.be.false;
                    });
                });
            });
            describe("When an array of at least one element is supplied", function () {
                describe("When checkLength is not specified", function () {
                    it("should return true", function () {
                        var isDefined = ObjectUtilities.isDefined([123]);
                        chai.expect(isDefined).to.be.true;
                    });
                });
                describe("When checkLength is specified as false", function () {
                    it("should return true", function () {
                        var isDefined = ObjectUtilities.isDefined([123], false);
                        chai.expect(isDefined).to.be.true;
                    });
                });
                describe("When checkLength is specified as true", function () {
                    it("should return true", function () {
                        var isDefined = ObjectUtilities.isDefined([123], true);
                        chai.expect(isDefined).to.be.true;
                    });
                });
            });
        });
    });
    describe("isTrue", function () {
        describe("When called with null value", function () {
            it("should return boolean false", function () {
                var resultFlag = ObjectUtilities.isTrue(null);
                chai.expect(resultFlag).to.equal(false);
            });
        });
        describe("When called with empty string", function () {
            it("should return boolean false", function () {
                var checkString = "";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(false);
            });
        });
        describe("When called with string value true", function () {
            it("should return boolean true", function () {
                var checkString = "true";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(true);
            });
        });
        describe("When called with string value false", function () {
            it("should return boolean false", function () {
                var checkString = "false";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(false);
            });
        });
        describe("When called with string value false with capital letter", function () {
            it("should return boolean false", function () {
                var checkString = "FALSE";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(false);
            });
        });
        describe("When called with string value true with capital letter", function () {
            it("should return boolean true", function () {
                var checkString = "TRUE";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(true);
            });
        });
        describe("When called with boolean value true", function () {
            it("should return boolean true", function () {
                var checkString = true;
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(true);
            });
        });
        describe("When called with boolean value false", function () {
            it("should return boolean false", function () {
                var checkString = false;
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(false);
            });
        });
        describe("When called with string value false with spaces", function () {
            it("should return boolean false", function () {
                var checkString = " false  ";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(false);
            });
        });
        describe("When called with string value true with spaces", function () {
            it("should return boolean true", function () {
                var checkString = " true  ";
                var resultFlag = ObjectUtilities.isTrue(checkString);
                chai.expect(resultFlag).to.equal(true);
            });
        });
    });
});
//# sourceMappingURL=ObjectUtilitiesSpec.js.map