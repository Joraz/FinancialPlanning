/// <reference path="../../typings/tsd.d.ts" />

import chai = require("chai");

import IUser = require("../../interfaces/customObjects/IUser");
import TokenProvider = require("../../security/TokenProvider");

describe("TokenProvider", () =>
{
    describe("generateJWT", () =>
    {
        describe("When provided with a null 'user' parameter", () =>
        {
            it("should throw an Error", () =>
            {
                chai.expect(() =>
                {
                    var token = TokenProvider.generateJWT(null);
                }).to.throw("A valid IUser object must be provided to TokenProvider::generateJWT().");
            });
        });

        describe("When provided with a valid 'user' parameter", () =>
        {
            it("should create and return a JWT object", () =>
            {
                var user: IUser = {
                    hash: "$2a$10$xPHDDDVMmLMzkekwacuo0ePjkZmikkV7Xvowjt9oqrmQrthAYVQwS",
                    salt: "$2a$10$xPHDDDVMmLMzkekwacuo0e",
                    _id: "test-user"
                };

                var token = TokenProvider.generateJWT(user);
                chai.expect(token).to.not.be.undefined;
                chai.expect(typeof token).to.equal('string');
            });
        });
    });
});