/// <reference path="../typings/tsd.d.ts" />

import bcrypt = require("bcrypt-nodejs");
import es6promise = require("es6-promise");

var Promise = es6promise.Promise;

class HashProvider
{
    /**
     *
     * @param password
     * @returns {*}
     */
    public static createHash(password: string): Promise<FinancialPlanning.Security.IPasswordHash>
    {
        return new Promise((resolve, reject) =>
        {
            if (!password || password.trim().length === 0)
            {
                return reject(new Error("Required parameter 'password' not provided in HashProvider::createHash()."));
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
                        var pwHash: FinancialPlanning.Security.IPasswordHash = {
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
            if (!providedPassword || providedPassword.trim().length === 0)
            {
                return reject(new Error("Required parameter 'providedPassword' not provided in HashProvider::checkHash()."));
            }

            if (!dbHash || dbHash.trim().length === 0)
            {
                return reject(new Error("Required parameter 'dbHash' not provided in HashProvider::checkHash()."));
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

export = HashProvider;