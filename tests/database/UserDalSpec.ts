/// <reference path="../../typings/tsd.d.ts" />

import chai = require("chai");
import moment = require("moment");

import Database = require("../../database/Database");
import UserDal = require("../../database/UserDal");

var database: FinancialPlanning.Server.Database.IDatabase;
var userDal: UserDal;

describe("UserDal", () =>
{
    before(() =>
    {
        // create a new test collection
        database = new Database();
        userDal = new UserDal(database, "user-test");
    });

    after(() =>
    {
        // drop the test collection and close the DB connection
        database.deleteCollection("user-test")
            .then(() =>
            {
                database.close();
            });
    });

    describe("getUser", () =>
    {
        describe("When called with invalid parameters", () =>
        {
            describe("When called with a null 'userId' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.getUser(null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'userId' parameter provided in UserDal::getUser().");
                        });
                });
            });

            describe("When called with an empty string 'userId' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.getUser("")
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'userId' parameter provided in UserDal::getUser().");
                        });
                });
            });
        });

        describe("When called with valid parameters", () =>
        {
            describe("When the user does not exist in the database", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.getUser("does-not-exist")
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: Error) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal('No item found using match: {"_id":"does-not-exist"}');
                        });
                });
            });

            describe("When the user does exist in the database", () =>
            {
                before(() =>
                {
                    var user: FinancialPlanning.Server.Users.IUser = {
                        hash: "$2a$10$xPHDDDVMmLMzkekwacuo0ePjkZmikkV7Xvowjt9oqrmQrthAYVQwS",
                        salt: "$2a$10$xPHDDDVMmLMzkekwacuo0e",
                        _id: "test-user",
                        balance: 0,
                        options: {}
                    };

                    return database.writeObject("user-test", user);
                });

                it("should return a promise that is resolved with the user information", () =>
                {
                    return userDal.getUser("test-user")
                        .then((response: FinancialPlanning.Server.Users.IUser) =>
                        {
                            chai.expect(response).to.not.be.undefined;
                            chai.expect(response._id).to.equal("test-user");
                            chai.expect(response.hash).to.equal("$2a$10$xPHDDDVMmLMzkekwacuo0ePjkZmikkV7Xvowjt9oqrmQrthAYVQwS")
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.be.undefined;
                        });

                });
            });
        });
    });

    describe("createUser", () =>
    {
        describe("When called with invalid parameters", () =>
        {
            describe("When called with a null 'user' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.createUser(null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'user' parameter provided in UserDal::createUser().");
                        });
                });
            });
        });

        describe("When called with valid parameters", () =>
        {
            describe("When no user with that id exists in the datastore", () =>
            {
                it("should insert that document into the datastore", () =>
                {
                    var user: FinancialPlanning.Server.Users.IUser = {
                        _id: "test-user-4",
                        hash: "$2a$10$xPHDDDVMmLMzkekwacuo0ePjkZmikkV7Xvowjt9oqrmQrthAYVQwS",
                        salt: "$2a$10$xPHDDDVMmLMzkekwacuo0e",
                        balance: 0,
                        options: {}
                    };

                    return userDal.createUser(user)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.not.be.undefined;

                            // sanity check, attempt to get the user
                            return userDal.getUser("test-user-4")
                                .then((user: FinancialPlanning.Server.Users.IUser) =>
                                {
                                    chai.expect(user).to.not.be.undefined;
                                    chai.expect(user.hash).to.equal("$2a$10$xPHDDDVMmLMzkekwacuo0ePjkZmikkV7Xvowjt9oqrmQrthAYVQwS");
                                })
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.be.undefined;
                        });
                });
            });

            describe("When a user with that id already exists in the datastore", () =>
            {
                before(() =>
                {
                    var user: FinancialPlanning.Server.Users.IUser = {
                        _id: "test-user-5",
                        hash: "$2a$04$Mca718mu6umaaVzlR6zEGuBB8miEEhqSgOUJuMO1ub1EUJbdcQJUS",
                        salt: "$2a$04$Mca718mu6umaaVzlR6zEGu",
                        balance: 33,
                        options: {}
                    };

                    return database.writeObject("user-test", user);
                });

                it("should return a promise that is rejected with an error", () =>
                {
                    var user: FinancialPlanning.Server.Users.IUser = {
                        _id: "test-user-5",
                        hash: "$2a$12$tdg7BvsrQbwWcPt8u4oh2OGAKVS58Q1O4d/sXqFUKC57iC8VhVqTe",
                        salt: "$2a$12$tdg7BvsrQbwWcPt8u4oh2O",
                        balance: 0,
                        options: {}
                    };

                    return userDal.createUser(user)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("Could not create user test-user-5 because it already exists.");
                        });
                });
            });
        });
    });

    describe("deleteUser", () =>
    {
        describe("When called with invalid parameters", () =>
        {
            describe("When called with a null 'userId' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.deleteUser(null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'userId' parameter provided in UserDal::deleteUser().");
                        });
                });
            });

            describe("When called with an empty string 'userId' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.deleteUser("")
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'userId' parameter provided in UserDal::deleteUser().");
                        });
                });
            });
        });

        describe("When called with valid parameters", () =>
        {
            describe("When the user exists in the database", () =>
            {
                before(() =>
                {
                    var user: FinancialPlanning.Server.Users.IUser = {
                        _id: "test-user-6",
                        hash: "$2a$12$nb6CLKgPwp/CtdvbmWkK6OKxyiG7UdcQoQo7uOtwlcYhgYdZBFrwi",
                        salt: "$2a$12$nb6CLKgPwp/CtdvbmWkK6O",
                        balance: 235987,
                        options: {}
                    };

                    return database.writeObject("user-test", user);
                });

                it("should delete that user", () =>
                {
                    return userDal.deleteUser("test-user-6")
                        .then((response: string) =>
                        {
                            chai.expect(response).to.not.be.undefined;
                            chai.expect(response).to.equal("Success");
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.be.undefined;
                        });
                });
            });

            describe("When the user does not exist in the database", () =>
            {
                it("should reject the promise with an error", () =>
                {
                    return userDal.deleteUser("does-not-exist")
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("Could not delete user does-not-exist");
                        });
                });
            });
        });
    });

    describe("updatePassword", () =>
    {
        describe("When called with invalid parameters", () =>
        {
            describe("When called with a null 'userId' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.updatePassword(null, null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'userId' parameter provided in UserDal::updatePassword().");
                        });
                });
            });

            describe("When called with an empty string 'userId' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.updatePassword("", null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'userId' parameter provided in UserDal::updatePassword().");
                        });
                });
            });

            describe("When called with a null 'hash' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.updatePassword("test-user", null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'hash' parameter provided in UserDal::updatePassword().");
                        });
                });
            });
        });

        describe("When called with valid parameters", () =>
        {
            describe("When the user exists in the database", () =>
            {
                before(() =>
                {
                    var user: FinancialPlanning.Server.Users.IUser = {
                        _id: "test-user-8",
                        hash: "$2a$12$Q5E1cZrVgg2wX.rKPn1r4ewO.BRuw3XobuEmO47Q0Iq0/TBxt1ByK",
                        salt: "$2a$12$Q5E1cZrVgg2wX.rKPn1r4e",
                        balance: 0,
                        options: {}
                    };

                    return database.writeObject("user-test", user);
                });

                it("should update the hash & salt for that user", () =>
                {
                    var updated = {
                        hash: "$2a$04$Jkh8.TlCLvZIH75pL2.PNOz18zwqu7R/U/gGNdzTvbuot5y4HWrQa",
                        salt: "$2a$04$Jkh8.TlCLvZIH75pL2.PNO"
                    };

                    return userDal.updatePassword("test-user-8", updated)
                        .then((response: FinancialPlanning.Server.Users.IUser) =>
                        {
                            chai.expect(response).to.not.be.undefined;
                            chai.expect(response.hash).to.equal("$2a$04$Jkh8.TlCLvZIH75pL2.PNOz18zwqu7R/U/gGNdzTvbuot5y4HWrQa");
                            chai.expect(response._id).to.equal("test-user-8");
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.be.undefined;
                        });
                });
            });

            describe("When the user does not exist in the database", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    var updated = {
                        hash: "$2a$04$Jkh8.TlCLvZIH75pL2.PNOz18zwqu7R/U/gGNdzTvbuot5y4HWrQa",
                        salt: "$2a$04$Jkh8.TlCLvZIH75pL2.PNO"
                    };

                    return userDal.updatePassword("does-not-exist", updated)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal('No item found using match: {"_id":"does-not-exist"}');
                        });
                });
            });
        });
    });

    describe("updatePreferredName", () =>
    {
        describe("When called with invalid parameters", () =>
        {
            describe("When called with a null 'userId' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.updatePreferredName(null, null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'userId' parameter provided in UserDal::updatePreferredName().");
                        });
                });
            });

            describe("When called with an empty string 'userId' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.updatePreferredName("", null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'userId' parameter provided in UserDal::updatePreferredName().");
                        });
                });
            });

            describe("When called with a null 'preferredName' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.updatePreferredName("test-user", null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'preferredName' parameter provided in UserDal::updatePreferredName().");
                        });
                });
            });

            describe("When called with an empty string 'preferredName' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.updatePreferredName("test-user", "")
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'preferredName' parameter provided in UserDal::updatePreferredName().");
                        });
                });
            });
        });

        describe("When called with valid parameters", () =>
        {
            describe("When the user exists in the database", () =>
            {
                describe("When the user has no preferredName set", () =>
                {
                    before(() =>
                    {
                        var user: FinancialPlanning.Server.Users.IUser = {
                            _id: "test-user-9",
                            hash: "$2a$04$vFQs1CATWtToHODnVa260.ziUO5qEqIR1WzW2BMUzeCgruRJ3mGHS",
                            salt: "$2a$04$vFQs1CATWtToHODnVa260.",
                            balance: 0,
                            options: {}
                        };

                        return database.writeObject("user-test", user);
                    });

                    it("should set it to be the supplied name", () =>
                    {
                        return userDal.updatePreferredName("test-user-9", "Jeff")
                            .then((response: FinancialPlanning.Server.Users.IUser) =>
                            {
                                chai.expect(response).to.not.be.undefined;
                                chai.expect(response.options.preferredName).to.equal("Jeff");
                                chai.expect(response.options.lowLimitWarning).to.be.undefined;
                            })
                            .catch((error: any) =>
                            {
                                chai.expect(error).to.be.undefined;
                            });
                    });
                });

                describe("When the user has a preferredName set", () =>
                {
                    before(() =>
                    {
                        var user: FinancialPlanning.Server.Users.IUser = {
                            _id: "test-user-10",
                            hash: "$2a$04$A2ABRioqtmQYTX2/NUEk2eK65fPdCac58Na/pNeP7kjkXCmYegwmK",
                            salt: "$2a$04$A2ABRioqtmQYTX2/NUEk2e.",
                            balance: 0,
                            options: {
                                preferredName: "Bob",
                                lowLimitWarning: 0
                            }
                        };

                        return database.writeObject("user-test", user);
                    });

                    it("should update it to be the supplied name", () =>
                    {
                        return userDal.updatePreferredName("test-user-10", "Fred")
                            .then((response: FinancialPlanning.Server.Users.IUser) =>
                            {
                                chai.expect(response).to.not.be.undefined;
                                chai.expect(response.options.preferredName).to.equal("Fred");
                                chai.expect(response.options.lowLimitWarning).to.equal(0);
                            })
                            .catch((error: any) =>
                            {
                                chai.expect(error).to.be.undefined;
                            });
                    });
                });
            });

            describe("When the user does not exist in the database", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.updatePreferredName("does-not-exist", "Kate")
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal('No item found using match: {"_id":"does-not-exist"}');
                        });
                });
            });
        });
    });

    describe("updateLimitWarning", () =>
    {
        describe("When called with invalid parameters", () =>
        {
            describe("When called with a null 'userId' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.updateLimitWarning(null, null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'userId' parameter provided in UserDal::updateLimitWarning().");
                        });
                });
            });

            describe("When called with an empty string 'userId' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.updateLimitWarning("", null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'userId' parameter provided in UserDal::updateLimitWarning().");
                        });
                });
            });

            describe("When called with a null 'limitWarning' parameter", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.updateLimitWarning("test-user", null)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal("No 'limitWarning' parameter provided in UserDal::updateLimitWarning().");
                        });
                });
            });
        });

        describe("When called with valid parameters", () =>
        {
            describe("When the user exists in the database", () =>
            {
                describe("When the user does not have a limit set", () =>
                {
                    before(() =>
                    {
                        var user: FinancialPlanning.Server.Users.IUser = {
                            _id: "test-user-11",
                            hash: "$2a$04$ZWfjTdftGbRAWIYwszPOseCyBn/bY.nIcX8TWpFBND0wPUyu6Mtbi",
                            salt: "$2a$04$ZWfjTdftGbRAWIYwszPOseC",
                            balance: 0,
                            options: {}
                        };

                        return database.writeObject("user-test", user);
                    });

                    it("should set it to be the supplied limit", () =>
                    {
                        return userDal.updateLimitWarning("test-user-11", -75)
                            .then((response: FinancialPlanning.Server.Users.IUser) =>
                            {
                                chai.expect(response).to.not.be.undefined;
                                chai.expect(response.options.lowLimitWarning).to.equal(-75);
                                chai.expect(response.options.preferredName).to.be.undefined;
                            })
                            .catch((error: any) =>
                            {
                                chai.expect(error).to.be.undefined;
                            });
                    });
                });

                describe("When the user does have a limit set", () =>
                {
                    before(() =>
                    {
                        var user: FinancialPlanning.Server.Users.IUser = {
                            _id: "test-user-12",
                            hash: "$2a$04$ZWfjTdftGbRAWIYwszPOseCyBn/bY.nIcX8TWpFBND0wPUyu6Mtbi",
                            salt: "$2a$04$ZWfjTdftGbRAWIYwszPOseC",
                            balance: 0,
                            options: {
                                lowLimitWarning: -10,
                                preferredName: "Megan"
                            }
                        };

                        return database.writeObject("user-test", user);
                    });

                    it("should update it to be the supplied limit", () =>
                    {
                        return userDal.updateLimitWarning("test-user-12", -50)
                            .then((response: FinancialPlanning.Server.Users.IUser) =>
                            {
                                chai.expect(response).to.not.be.undefined;
                                chai.expect(response.options.lowLimitWarning).to.equal(-50);
                                chai.expect(response.options.preferredName).to.equal("Megan");
                            })
                            .catch((error: any) =>
                            {
                                chai.expect(error).to.be.undefined;
                            });
                    });
                });
            });

            describe("When the user does not exist in the database", () =>
            {
                it("should return a promise that is rejected with an error", () =>
                {
                    return userDal.updateLimitWarning("does-not-exist", 0)
                        .then((response: any) =>
                        {
                            chai.expect(response).to.be.undefined;
                        })
                        .catch((error: any) =>
                        {
                            chai.expect(error).to.not.be.undefined;
                            chai.expect(error.message).to.equal('No item found using match: {"_id":"does-not-exist"}');
                        });
                });
            });
        });
    });
});