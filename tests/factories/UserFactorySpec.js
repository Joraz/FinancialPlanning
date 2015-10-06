/// <reference path="../../typings/tsd.d.ts" />
var chai = require("chai");
var UserFactory = require("../../factories/UserFactory");
describe("UserFactory", function () {
    describe("createUser", function () {
        describe("When given invalid parameters", function () {
            describe("When given a null 'username' parameter", function () {
                it("should return a promise that is rejected with an error", function () {
                    return UserFactory.createUser(null, null)
                        .then(function (response) {
                        chai.expect(response).to.be.undefined;
                    })
                        .catch(function (error) {
                        chai.expect(error).to.not.be.undefined;
                        chai.expect(error.message).to.equal("No 'username' parameter provided in UserFactory::createUser().");
                    });
                });
            });
            describe("When given an empty string 'username' parameter", function () {
                it("should return a promise that is rejected with an error", function () {
                    return UserFactory.createUser("", null)
                        .then(function (response) {
                        chai.expect(response).to.be.undefined;
                    })
                        .catch(function (error) {
                        chai.expect(error).to.not.be.undefined;
                        chai.expect(error.message).to.equal("No 'username' parameter provided in UserFactory::createUser().");
                    });
                });
            });
            describe("When given a null 'password' parameter", function () {
                it("should return a promise that is rejected with an error", function () {
                    return UserFactory.createUser("test-user", null)
                        .then(function (response) {
                        chai.expect(response).to.be.undefined;
                    })
                        .catch(function (error) {
                        chai.expect(error).to.not.be.undefined;
                        chai.expect(error.message).to.equal("No 'password' parameter provided in UserFactory::createUser().");
                    });
                });
            });
            describe("When given an empty string 'password' parameter", function () {
                it("should return a promise that is rejected with an error", function () {
                    return UserFactory.createUser("test-user", "")
                        .then(function (response) {
                        chai.expect(response).to.be.undefined;
                    })
                        .catch(function (error) {
                        chai.expect(error).to.not.be.undefined;
                        chai.expect(error.message).to.equal("No 'password' parameter provided in UserFactory::createUser().");
                    });
                });
            });
        });
        describe("When given valid parameters", function () {
            describe("When no balance is given", function () {
                it("should return a promise that is resolved to an IUser object with a default balance of 0", function () {
                    return UserFactory.createUser("test-user", "password")
                        .then(function (user) {
                        chai.expect(user).to.not.be.undefined;
                        chai.expect(user._id).to.equal("test-user");
                        chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                        chai.expect(user.balance).to.equal(0);
                    })
                        .catch(function (error) {
                        chai.expect(error).to.be.undefined;
                    });
                });
            });
            describe("When a balance is given", function () {
                it("should return a promise that is resolved to an IUser object with the balance set", function () {
                    return UserFactory.createUser("test-user", "password", 546.12)
                        .then(function (user) {
                        chai.expect(user).to.not.be.undefined;
                        chai.expect(user._id).to.equal("test-user");
                        chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                        chai.expect(user.balance).to.equal(546.12);
                    })
                        .catch(function (error) {
                        chai.expect(error).to.be.undefined;
                    });
                });
            });
            describe("When user options are not given (null)", function () {
                it("should return a promise that is resolved to an IUser object with an empty 'options' property", function () {
                    return UserFactory.createUser("test-user", "password", null, null)
                        .then(function (user) {
                        chai.expect(user).to.not.be.undefined;
                        chai.expect(user._id).to.equal("test-user");
                        chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                        chai.expect(user.balance).to.equal(0);
                        chai.expect(user.options).to.deep.equal({});
                    })
                        .catch(function (error) {
                        chai.expect(error).to.be.undefined;
                    });
                });
            });
            describe("When user options are given", function () {
                describe("When an empty object is given", function () {
                    it("should return a promise that is resolved to an IUser object with an empty 'options' property", function () {
                        return UserFactory.createUser("test-user", "password", null, {})
                            .then(function (user) {
                            chai.expect(user).to.not.be.undefined;
                            chai.expect(user._id).to.equal("test-user");
                            chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                            chai.expect(user.balance).to.equal(0);
                            chai.expect(user.options).to.deep.equal({});
                        })
                            .catch(function (error) {
                            chai.expect(error).to.be.undefined;
                        });
                    });
                });
                describe("When a non-empty object is given", function () {
                    describe("When it has a preferredName property", function () {
                        it("should return a promise that is resolved to an IUser object with a preferredName property", function () {
                            return UserFactory.createUser("test-user", "password", null, { preferredName: "Jeff" })
                                .then(function (user) {
                                chai.expect(user).to.not.be.undefined;
                                chai.expect(user._id).to.equal("test-user");
                                chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                                chai.expect(user.balance).to.equal(0);
                                chai.expect(user.options).to.not.be.undefined;
                                chai.expect(user.options.preferredName).to.equal("Jeff");
                                chai.expect(user.options.lowLimitWarning).to.be.undefined;
                            })
                                .catch(function (error) {
                                chai.expect(error).to.be.undefined;
                            });
                        });
                    });
                    describe("When it has a lowLimitWarning property", function () {
                        it("should return a promise that is resolved to an IUser object with a lowLimitWarning property", function () {
                            return UserFactory.createUser("test-user", "password", null, { lowLimitWarning: 0 })
                                .then(function (user) {
                                chai.expect(user).to.not.be.undefined;
                                chai.expect(user._id).to.equal("test-user");
                                chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                                chai.expect(user.balance).to.equal(0);
                                chai.expect(user.options).to.not.be.undefined;
                                chai.expect(user.options.preferredName).to.be.undefined;
                                chai.expect(user.options.lowLimitWarning).to.equal(0);
                            })
                                .catch(function (error) {
                                chai.expect(error).to.be.undefined;
                            });
                        });
                    });
                    describe("When it has both properties", function () {
                        it("should return a promise that is resolved to an IUser object with both properties", function () {
                            return UserFactory.createUser("test-user", "password", null, { lowLimitWarning: 0, preferredName: "Jeff" })
                                .then(function (user) {
                                chai.expect(user).to.not.be.undefined;
                                chai.expect(user._id).to.equal("test-user");
                                chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                                chai.expect(user.balance).to.equal(0);
                                chai.expect(user.options).to.not.be.undefined;
                                chai.expect(user.options.preferredName).to.equal("Jeff");
                                chai.expect(user.options.lowLimitWarning).to.equal(0);
                            })
                                .catch(function (error) {
                                chai.expect(error).to.be.undefined;
                            });
                        });
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=UserFactorySpec.js.map