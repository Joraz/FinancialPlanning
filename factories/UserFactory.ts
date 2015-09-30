/// <reference path="../typings/tsd.d.ts" />

import es6promise = require("es6-promise");

import HashFactory = require("./HashFactory");
import ObjectUtilities = require("../utilities/ObjectUtilities");

var Promise = es6promise.Promise;

/**
 * Static class to create users
 */
class UserFactory
{
    /**
     * Create a new user using the provided parameters
     * @param username
     * @param password
     * @param balance
     * @param options
     * @returns {*}
     */
    public static createUser(username: string, password: string, balance?: number, options?: FinancialPlanning.Server.Users.IUserOptions): Promise<FinancialPlanning.Server.Users.IUser>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(username, true))
            {
                return reject(new Error("No 'username' parameter provided in UserFactory::createUser()."));
            }

            if (!ObjectUtilities.isDefined(password, true))
            {
                return reject(new Error("No 'password' parameter provided in UserFactory::createUser()."));
            }

            HashFactory.createHash(password)
                .then((passwordHash: FinancialPlanning.Server.Security.IPasswordHash) =>
                {
                    var user: FinancialPlanning.Server.Users.IUser = {
                        _id: username,
                        hash: passwordHash.hash,
                        salt: passwordHash.salt,
                        balance: ObjectUtilities.isDefined(balance) ? parseFloat(balance.toFixed(2)) : 0,
                        options: {}
                    };

                    if (ObjectUtilities.isDefined(options) &&
                        (ObjectUtilities.isDefined(options.lowLimitWarning) || (ObjectUtilities.isDefined(options.preferredName))))
                    {
                        user.options = options;
                    }

                    return resolve(user);
                })
                .catch((error: any) =>
                {
                    return reject(error);
                });
        });
    }
}

export = UserFactory;