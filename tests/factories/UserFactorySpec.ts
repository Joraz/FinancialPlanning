/// <reference path="../../typings/tsd.d.ts" />

import chai = require("chai");

import UserFactory = require("../../factories/UserFactory");

describe("UserFactory", () =>
{
    describe("createUser", () =>
    {
        describe("When given invalid parameters", () =>
        {
            describe("When given a null 'username' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return UserFactory.createUser(null, null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'username' parameter provided in UserFactory::createUser().");
                        });
                });
            });

            describe("When given an empty string 'username' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return UserFactory.createUser("", null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'username' parameter provided in UserFactory::createUser().");
                        });
                });
            });

            describe("When given a null 'password' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return UserFactory.createUser("test-user", null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'password' parameter provided in UserFactory::createUser().");
                        });
                });
            });

            describe("When given an empty string 'password' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return UserFactory.createUser("test-user", "")
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'password' parameter provided in UserFactory::createUser().");
                        });
                });
            });
        });

        describe("When given valid parameters", () =>
        {
            describe("When no balance is given", () =>
            {
                it("should return a promise that is resolved to an IUser object with a default balance of 0", () =>
                {
                    return UserFactory.createUser("test-user", "password")
                        .then((user: FinancialPlanning.Server.Users.IUser) =>
                        {
                            chai.expect(user).to.not.be.undefined;
                            chai.expect(user._id).to.equal("test-user");
                            chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                            chai.expect(user.balance).to.equal(0);
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.be.undefined;
                        });
                });
            });

            describe("When a balance is given", () =>
            {
                it("should return a promise that is resolved to an IUser object with the balance set", () =>
                {
                    return UserFactory.createUser("test-user", "password", 546.12)
                        .then((user: FinancialPlanning.Server.Users.IUser) =>
                        {
                            chai.expect(user).to.not.be.undefined;
                            chai.expect(user._id).to.equal("test-user");
                            chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                            chai.expect(user.balance).to.equal(546.12);
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.be.undefined;
                        });
                });
            });

            describe("When user options are not given (null)", () =>
            {
                it("should return a promise that is resolved to an IUser object with an empty 'options' property", () =>
                {
                    return UserFactory.createUser("test-user", "password", null, null)
                        .then((user: FinancialPlanning.Server.Users.IUser) =>
                        {
                            chai.expect(user).to.not.be.undefined;
                            chai.expect(user._id).to.equal("test-user");
                            chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                            chai.expect(user.balance).to.equal(0);
                            chai.expect(user.options).to.deep.equal({});
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.be.undefined;
                        });
                });
            });

            describe("When user options are given", () =>
            {
                describe("When an empty object is given", () =>
                {
                    it("should return a promise that is resolved to an IUser object with an empty 'options' property", () =>
                    {
                        return UserFactory.createUser("test-user", "password", null, {})
                            .then((user: FinancialPlanning.Server.Users.IUser) =>
                            {
                                chai.expect(user).to.not.be.undefined;
                                chai.expect(user._id).to.equal("test-user");
                                chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                                chai.expect(user.balance).to.equal(0);
                                chai.expect(user.options).to.deep.equal({});
                            })
                            .catch((error: any) =>
                            {
                                chai.expect(error).to.be.undefined;
                            });
                    });
                });

                describe("When a non-empty object is given", () =>
                {
                    describe("When it has a preferredName property", () =>
                    {
                        it("should return a promise that is resolved to an IUser object with a preferredName property", () =>
                        {
                            return UserFactory.createUser("test-user", "password", null, {preferredName: "Jeff"})
                                .then((user: FinancialPlanning.Server.Users.IUser) =>
                                {
                                    chai.expect(user).to.not.be.undefined;
                                    chai.expect(user._id).to.equal("test-user");
                                    chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                                    chai.expect(user.balance).to.equal(0);
                                    chai.expect(user.options).to.not.be.undefined;
                                    chai.expect(user.options.preferredName).to.equal("Jeff");
                                    chai.expect(user.options.lowLimitWarning).to.be.undefined;
                                })
                                .catch((error: any) =>
                                {
                                    chai.expect(error).to.be.undefined;
                                });
                        });
                    });

                    describe("When it has a lowLimitWarning property", () =>
                    {
                        it("should return a promise that is resolved to an IUser object with a lowLimitWarning property", () =>
                        {
                            return UserFactory.createUser("test-user", "password", null, {lowLimitWarning: 0})
                                .then((user: FinancialPlanning.Server.Users.IUser) =>
                                {
                                    chai.expect(user).to.not.be.undefined;
                                    chai.expect(user._id).to.equal("test-user");
                                    chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                                    chai.expect(user.balance).to.equal(0);
                                    chai.expect(user.options).to.not.be.undefined;
                                    chai.expect(user.options.preferredName).to.be.undefined;
                                    chai.expect(user.options.lowLimitWarning).to.equal(0);
                                })
                                .catch((error: any) =>
                                {
                                    chai.expect(error).to.be.undefined;
                                });
                        });
                    });

                    describe("When it has both properties", () =>
                    {
                        it("should return a promise that is resolved to an IUser object with both properties", () =>
                        {
                            return UserFactory.createUser("test-user", "password", null, {lowLimitWarning: 0, preferredName: "Jeff"})
                                .then((user: FinancialPlanning.Server.Users.IUser) =>
                                {
                                    chai.expect(user).to.not.be.undefined;
                                    chai.expect(user._id).to.equal("test-user");
                                    chai.expect(user.hash).to.match(/^\$2a\$.{56}$/g);
                                    chai.expect(user.balance).to.equal(0);
                                    chai.expect(user.options).to.not.be.undefined;
                                    chai.expect(user.options.preferredName).to.equal("Jeff");
                                    chai.expect(user.options.lowLimitWarning).to.equal(0);
                                })
                                .catch((error: any) =>
                                {
                                    chai.expect(error).to.be.undefined;
                                });
                        });
                    });
                });
            });
        });
    });
});