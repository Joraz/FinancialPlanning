/// <reference path="../typings/tsd.d.ts" />

import bcrypt = require("bcrypt-nodejs");
import es6promise = require("es6-promise");

import ObjectUtilities = require("../utilities/ObjectUtilities");

var Promise = es6promise.Promise;

class HashFactory
{
    /**
     *
     * @param password
     * @returns {*}
     */
    public static createHash(password: string): Promise<FinancialPlanning.Server.Security.IPasswordHash>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(password, true))
            {
                return reject(new Error("No 'password' parameter provided in HashFactory::createHash()."));
            }

            bcrypt.genSalt(10, (error: Error, salt: string) =>
            {
                if (error)
                {
                    return reject(error);
                }

                bcrypt.hash(password, salt, null, (error: Error, hash: string) =>
                {
                    if (error)
                    {
                        return reject(error);
                    }
                    else
                    {
                        var pwHash: FinancialPlanning.Server.Security.IPasswordHash = {
                            hash: hash,
                            salt: salt
                        };

                        return resolve(pwHash);
                    }
                });
            });
        });
    }

    /**
     *
     * @param providedPassword
     * @param dbHash
     * @returns {*}
     */
    public static checkHash(providedPassword: string, dbHash: string): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(providedPassword, true))
            {
                return reject(new Error("No 'providedPassword' parameter provided in HashFactory::checkHash()."));
            }

            if (!ObjectUtilities.isDefined(dbHash, true))
            {
                return reject(new Error("No 'dbHash' parameter provided in HashFactory::checkHash()."));
            }

            bcrypt.compare(providedPassword, dbHash, (error: Error, match: boolean) =>
            {
                if (error)
                {
                    return reject(error);
                }
                else
                {
                    return resolve(match);
                }
            });
        });
    }
}

export = HashFactory;