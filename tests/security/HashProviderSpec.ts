/// <reference path="../../typings/tsd.d.ts" />

import chai = require("chai");

import HashProvider = require("../../security/HashProvider");
import IPasswordHash = require("../../interfaces/security/IPasswordHash");

describe("HashProvider", () =>
{
    describe("createHash", () =>
    {
        describe("When called with a null 'password' parameter", () =>
        {
            it("should return a promise that is rejected with an error", () =>
            {
                return HashProvider.createHash(null)
                    .then((response: any) =>
                    {
                        // Code here should not run. Fail the test if it is
                        chai.expect(response).to.be.undefined;
                    })
                    .catch((error: Error) =>
                    {
                        chai.expect(error).to.not.be.undefined;
                        chai.expect(error.message).to.equal("Required parameter 'password' not provided in HashProvider::createHash().");
                    });
            });
        });

        describe("When called with an empty string 'password' parameter", () =>
        {
            it("should return a promise that is rejected with an error", () =>
            {
                return HashProvider.createHash("    ")
                    .then((response: any) =>
                    {
                        chai.expect(response).to.be.undefined;
                    })
                    .catch((error: Error) =>
                    {
                        chai.expect(error).to.not.be.undefined;
                        chai.expect(error.message).to.equal("Required parameter 'password' not provided in HashProvider::createHash().");
                    });
            });
        });

        describe("When called with a valid 'password' parameter", () =>
        {
            it("should return an IPasswordHash object, containing a hash and a salt generated from the password", () =>
            {
                return HashProvider.createHash("Sausages")
                    .then((response: IPasswordHash) =>
                    {
                        chai.expect(response).to.not.be.undefined;
                        // regex match for bcrypt hash
                        chai.expect(response.hash).to.match(/^\$2a\$.{56}$/g);
                    })
                    .catch((error: any) =>
                    {
                        chai.expect(error).to.be.undefined;
                    });
            });
        });
    });

    describe("checkHash", () =>
    {
        describe("When called with a null 'providedPassword' parameter", () =>
        {
            it("it should return a promise that is rejected with an error", () =>
            {
                return HashProvider.checkHash(null, null)
                    .then((response: any) =>
                    {
                        chai.expect(response).to.be.undefined;
                    })
                    .catch((error: Error) =>
                    {
                        chai.expect(error).to.not.be.undefined;
                        chai.expect(error.message).to.equal("Required parameter 'providedPassword' not provided in HashProvider::checkHash().");
                    });
            });
        });

        describe("When called with an empty string 'providedPassword' parameter", () =>
        {
            it("it should return a promise that is rejected with an error", () =>
            {
                return HashProvider.checkHash(null, null)
                    .then((response: any) =>
                    {
                        chai.expect(response).to.be.undefined;
                    })
                    .catch((error: Error) =>
                    {
                        chai.expect(error).to.not.be.undefined;
                        chai.expect(error.message).to.equal("Required parameter 'providedPassword' not provided in HashProvider::checkHash().");
                    });
            });
        });

        describe("When called with a null 'dbHash' parameter", () =>
        {
            it("should return a promise that is rejected with an error", () =>
            {
                return HashProvider.checkHash("test", null)
                    .then((response: any) =>
                    {
                        chai.expect(response).to.be.undefined;
                    })
                    .catch((error: Error) =>
                    {
                        chai.expect(error).to.not.be.undefined;
                        chai.expect(error.message).to.equal("Required parameter 'dbHash' not provided in HashProvider::checkHash().");
                    });
            });
        });

        describe("When called with an empty string 'dbHash' parameter", () =>
        {
            it("should return a promise that is rejected with an error", () =>
            {
                return HashProvider.checkHash("test", "      ")
                    .then((response: any) =>
                    {
                        chai.expect(response).to.be.undefined;
                    })
                    .catch((error: Error) =>
                    {
                        chai.expect(error).to.not.be.undefined;
                        chai.expect(error.message).to.equal("Required parameter 'dbHash' not provided in HashProvider::checkHash().");
                    });
            });
        });

        describe("When called with valid parameters that will not match", () =>
        {
            it("should return a promise that is resolved with false", () =>
            {
                return HashProvider.createHash("Sausages")
                    .then((hash: IPasswordHash) =>
                    {
                        return HashProvider.checkHash("Bacon", hash.hash);
                    })
                    .then((response: boolean) =>
                    {
                        chai.expect(response).to.be.false;
                    })
                    .catch((error: any) =>
                    {
                        chai.expect(error).to.be.undefined;
                    });
            });
        });

        describe("When called with valid parameters that will match", () =>
        {
            it("should return a promise that is resolved with true", () =>
            {
                return HashProvider.createHash("Sausages")
                    .then((hash: IPasswordHash) =>
                    {
                        return HashProvider.checkHash("Sausages", hash.hash);
                    })
                    .then((response: boolean) =>
                    {
                        chai.expect(response).to.be.true;
                    })
                    .catch((error: any) =>
                    {
                        chai.expect(error).to.be.undefined;
                    });
            });
        });
    });
});