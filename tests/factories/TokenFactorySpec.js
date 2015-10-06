/// <reference path="../../typings/tsd.d.ts" />
var chai = require("chai");
var TokenFactory = require("../../factories/TokenFactory");
describe("TokenFactory", function () {
    describe("generateJWT", function () {
        describe("When provided with a null 'userId' parameter", function () {
            it("should throw an Error", function () {
                chai.expect(function () {
                    var token = TokenFactory.generateJWT(null);
                }).to.throw("No 'userId' parameter provided in TokenFactory::generateJWT().");
            });
        });
        describe("When provided with an empty string 'userId' parameter", function () {
            it("should throw an Error", function () {
                chai.expect(function () {
                    var token = TokenFactory.generateJWT("");
                }).to.throw("No 'userId' parameter provided in TokenFactory::generateJWT().");
            });
        });
        describe("When provided with a valid 'user' parameter", function () {
            it("should create and return a JWT object", function () {
                var userId = "test-user";
                var token = TokenFactory.generateJWT(userId);
                chai.expect(token).to.not.be.undefined;
                chai.expect(typeof token).to.equal('string');
            });
        });
    });
});
//# sourceMappingURL=TokenFactorySpec.js.map