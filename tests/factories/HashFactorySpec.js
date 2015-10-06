/// <reference path="../../typings/tsd.d.ts" />
var chai = require("chai");
var HashFactory = require("../../factories/HashFactory");
describe("HashFactory", function () {
    describe("createHash", function () {
        describe("When called with a null 'password' parameter", function () {
            it("should return a promise that is rejected with an error", function () {
                return HashFactory.createHash(null)
                    .then(function (response) {
                    // Code here should not run. Fail the test if it is
                    chai.expect(response).to.be.undefined;
                })
                    .catch(function (error) {
                    chai.expect(error).to.not.be.undefined;
                    chai.expect(error.message).to.equal("No 'password' parameter provided in HashFactory::createHash().");
                });
            });
        });
        describe("When called with an empty string 'password' parameter", function () {
            it("should return a promise that is rejected with an error", function () {
                return HashFactory.createHash("")
                    .then(function (response) {
                    chai.expect(response).to.be.undefined;
                })
                    .catch(function (error) {
                    chai.expect(error).to.not.be.undefined;
                    chai.expect(error.message).to.equal("No 'password' parameter provided in HashFactory::createHash().");
                });
            });
        });
        describe("When called with a valid 'password' parameter", function () {
            it("should return an IPasswordHash object, containing a hash and a salt generated from the password", function () {
                return HashFactory.createHash("Sausages")
                    .then(function (response) {
                    chai.expect(response).to.not.be.undefined;
                    // regex match for bcrypt hash
                    chai.expect(response.hash).to.match(/^\$2a\$.{56}$/g);
                })
                    .catch(function (error) {
                    chai.expect(error).to.be.undefined;
                });
            });
        });
    });
    describe("checkHash", function () {
        describe("When called with a null 'providedPassword' parameter", function () {
            it("it should return a promise that is rejected with an error", function () {
                return HashFactory.checkHash(null, null)
                    .then(function (response) {
                    chai.expect(response).to.be.undefined;
                })
                    .catch(function (error) {
                    chai.expect(error).to.not.be.undefined;
                    chai.expect(error.message).to.equal("No 'providedPassword' parameter provided in HashFactory::checkHash().");
                });
            });
        });
        describe("When called with an empty string 'providedPassword' parameter", function () {
            it("it should return a promise that is rejected with an error", function () {
                return HashFactory.checkHash(null, null)
                    .then(function (response) {
                    chai.expect(response).to.be.undefined;
                })
                    .catch(function (error) {
                    chai.expect(error).to.not.be.undefined;
                    chai.expect(error.message).to.equal("No 'providedPassword' parameter provided in HashFactory::checkHash().");
                });
            });
        });
        describe("When called with a null 'dbHash' parameter", function () {
            it("should return a promise that is rejected with an error", function () {
                return HashFactory.checkHash("test", null)
                    .then(function (response) {
                    chai.expect(response).to.be.undefined;
                })
                    .catch(function (error) {
                    chai.expect(error).to.not.be.undefined;
                    chai.expect(error.message).to.equal("No 'dbHash' parameter provided in HashFactory::checkHash().");
                });
            });
        });
        describe("When called with an empty string 'dbHash' parameter", function () {
            it("should return a promise that is rejected with an error", function () {
                return HashFactory.checkHash("test", "")
                    .then(function (response) {
                    chai.expect(response).to.be.undefined;
                })
                    .catch(function (error) {
                    chai.expect(error).to.not.be.undefined;
                    chai.expect(error.message).to.equal("No 'dbHash' parameter provided in HashFactory::checkHash().");
                });
            });
        });
        describe("When called with valid parameters that will not match", function () {
            it("should return a promise that is resolved with false", function () {
                return HashFactory.createHash("Sausages")
                    .then(function (hash) {
                    return HashFactory.checkHash("Bacon", hash.hash);
                })
                    .then(function (response) {
                    chai.expect(response).to.be.false;
                })
                    .catch(function (error) {
                    chai.expect(error).to.be.undefined;
                });
            });
        });
        describe("When called with valid parameters that will match", function () {
            it("should return a promise that is resolved with true", function () {
                return HashFactory.createHash("Sausages")
                    .then(function (hash) {
                    return HashFactory.checkHash("Sausages", hash.hash);
                })
                    .then(function (response) {
                    chai.expect(response).to.be.true;
                })
                    .catch(function (error) {
                    chai.expect(error).to.be.undefined;
                });
            });
        });
    });
});
//# sourceMappingURL=HashFactorySpec.js.map