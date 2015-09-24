/// <reference path="../../typings/tsd.d.ts" />

import chai = require("chai");
import moment = require("moment");

import TokenFactory = require("../../factories/TokenFactory");

describe("TokenFactory", () =>
{
    describe("generateJWT", () =>
    {
        describe("When provided with a null 'userId' parameter", () =>
        {
            it("should throw an Error", () =>
            {
                chai.expect(() =>
                {
                    var token = TokenFactory.generateJWT(null);
                }).to.throw("No 'userId' parameter provided in TokenFactory::generateJWT().");
            });
        });

        describe("When provided with an empty string 'userId' parameter", () =>
        {
            it("should throw an Error", () =>
            {
                chai.expect(() =>
                {
                    var token = TokenFactory.generateJWT("");
                }).to.throw("No 'userId' parameter provided in TokenFactory::generateJWT().");
            });
        });

        describe("When provided with a valid 'user' parameter", () =>
        {
            it("should create and return a JWT object", () =>
            {
                var userId = "test-user";
                var token = TokenFactory.generateJWT(userId);
                chai.expect(token).to.not.be.undefined;
                chai.expect(typeof token).to.equal('string');
            });
        });
    });
});