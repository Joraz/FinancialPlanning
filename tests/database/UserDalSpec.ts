/// <reference path="../../typings/tsd.d.ts" />

import chai = require("chai");

import Database = require("../../database/Database");
import IDatabase = require("../../interfaces/database/IDatabase");
import IUser = require("../../interfaces/customObjects/IUser");
import UserDal = require("../../database/UserDal");

var database: IDatabase;
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
        describe("When called with an id that does not exist", () =>
        {
            it("should return an error", () =>
            {
                return userDal.getUser("does-not-exist")
                    .then((response: any) =>
                    {
                        chai.expect(response).to.be.undefined;
                    })
                    .catch((error: Error) =>
                    {
                        chai.expect(error).to.not.be.undefined;
                        chai.expect(error).to.equal('Error: No item found using match:{"_id":"does-not-exist"}');
                    });
            });
        });

        describe("When called with an id that does exist", () =>
        {
            before(() =>
            {
                var user: IUser = {
                    hash: "$2a$10$xPHDDDVMmLMzkekwacuo0ePjkZmikkV7Xvowjt9oqrmQrthAYVQwS",
                    salt: "$2a$10$xPHDDDVMmLMzkekwacuo0e",
                    _id: "test-user"
                };

                return database.writeObject("user-test", user);
            });

            it("should return the user that matches that id", () =>
            {
                return userDal.getUser("test-user")
                    .then((response: IUser) =>
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

    describe("createUser", () =>
    {
        describe("When called with an IUser object that contains an _id not already found in the datastore", () =>
        {
            it("should insert that document into the datastore", () =>
            {
                var user: IUser = {
                    _id: "test-user-4",
                    hash: "$2a$10$xPHDDDVMmLMzkekwacuo0ePjkZmikkV7Xvowjt9oqrmQrthAYVQwS",
                    salt: "$2a$10$xPHDDDVMmLMzkekwacuo0e"
                };

                return userDal.createUser(user)
                    .then((response: any) =>
                    {
                        chai.expect(response).to.not.be.undefined;

                        // sanity check, attempt to get the user
                        return userDal.getUser("test-user-4")
                        .then((user: IUser) =>
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

        //TODO finish tests
    });
});