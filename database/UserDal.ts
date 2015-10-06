/// <reference path="../typings/tsd.d.ts" />

import es6promise = require("es6-promise");

import BaseDal = require("./baseDal");
import ObjectUtilities = require("../utilities/ObjectUtilities");

var Promise = es6promise.Promise;

/**
 * Class that provides methods to interact with the users MongoDB collection
 */
class UserDal extends BaseDal implements FinancialPlanning.Server.Database.IUserDal
{
    constructor(dataStore: FinancialPlanning.Server.Database.IDatabase, collectionName: string = "Users")
    {
        super(dataStore, collectionName);
    }

    /**
     * Get the specified user
     * @param userId
     * @returns {*}
     */
    public getUser(userId: string): Promise<FinancialPlanning.Server.Users.IUser>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(userId, true))
            {
                return reject(new Error("No 'userId' parameter provided in UserDal::getUser()."));
            }

            this.getDataStore().readObject(this.getCollectionName(), {"_id": userId}, {})
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Create a new user with the provided data
     * @param user
     * @returns {*}
     */
    public createUser(user: FinancialPlanning.Server.Users.IUser): Promise<FinancialPlanning.Server.Users.IUser>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(user))
            {
                return reject(new Error("No 'user' parameter provided in UserDal::createUser()."));
            }

            this.getDataStore().writeObject(this.getCollectionName(), user)
                .then(resolve)
                .catch((error: any) =>
                {
                    // duplicate error
                    if (error && error.code && error.code === 11000)
                    {
                        return reject(new Error("Could not create user " + user._id + " because it already exists."));
                    }
                    else
                    {
                        return reject(new Error("Error creating new user"));
                    }
                })
        });
    }

    /**
     * Delete a user with the specified ID
     * @param userId
     * @returns {*}
     */
    public deleteUser(userId: string): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(userId, true))
            {
                return reject(new Error("No 'userId' parameter provided in UserDal::deleteUser()."));
            }

            this.getDataStore().deleteObject(this.getCollectionName(), {"_id": userId})
                .then((response: boolean) =>
                {
                    if (response)
                    {
                        return resolve(true);
                    }
                    else
                    {
                        return reject(false);
                    }
                })
                .catch((error: any) =>
                {
                    if (error)
                    {
                        return reject(error)
                    }
                    else
                    {
                        return reject(new Error("Could not delete user " + userId));
                    }
                });
        });
    }

    /**
     * Update the password hash for a user
     * @param userId
     * @param hash
     * @returns {*}
     */
    public updatePassword(userId: string, hash: FinancialPlanning.Server.Security.IPasswordHash): Promise<FinancialPlanning.Server.Users.IUser>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(userId, true))
            {
                return reject(new Error("No 'userId' parameter provided in UserDal::updatePassword()."));
            }

            if (!ObjectUtilities.isDefined(hash))
            {
                return reject(new Error("No 'hash' parameter provided in UserDal::updatePassword()."));
            }

            var updateObject = {
                $set: {
                    hash: hash.hash,
                    salt: hash.salt
                }
            };

            this.getDataStore().updateObject(this.getCollectionName(), {"_id": userId}, updateObject)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Update the preferred name for a user
     * @param userId
     * @param preferredName
     * @returns {Promise<any>}
     */
    public updatePreferredName(userId: string, preferredName: string): Promise<FinancialPlanning.Server.Users.IUser>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(userId, true))
            {
                return reject(new Error("No 'userId' parameter provided in UserDal::updatePreferredName()."));
            }

            if (!ObjectUtilities.isDefined(preferredName, true))
            {
                return reject(new Error("No 'preferredName' parameter provided in UserDal::updatePreferredName()."));
            }

            var updateObject = {
                $set: {
                    "options.preferredName": preferredName
                }
            };

            this.getDataStore().updateObject(this.getCollectionName(), {"_id": userId}, updateObject)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Update the limit warning for a user
     * @param userId
     * @param limitWarning
     * @returns {Promise<any>}
     */
    public updateLimitWarning(userId: string, limitWarning: number): Promise<FinancialPlanning.Server.Users.IUser>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(userId, true))
            {
                return reject(new Error("No 'userId' parameter provided in UserDal::updateLimitWarning()."));
            }

            if (!ObjectUtilities.isDefined(limitWarning))
            {
                return reject(new Error("No 'limitWarning' parameter provided in UserDal::updateLimitWarning()."));
            }

            var updateObject = {
                $set: {
                    "options.lowLimitWarning": limitWarning
                }
            };

            this.getDataStore().updateObject(this.getCollectionName(), {"_id": userId}, updateObject)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Update the balance for a user
     * @param userId
     * @param balance
     * @returns {*}
     */
    public updateBalance(userId: string, balance: number): Promise<FinancialPlanning.Server.Users.IUser>
    {
        return new Promise((resolve, reject) =>
        {
            if (!ObjectUtilities.isDefined(userId, true))
            {
                return reject(new Error("No 'userId' parameter provided in UserDal::updateBalance()."));
            }

            if (!ObjectUtilities.isDefined(balance))
            {
                return reject(new Error("No 'balance' parameter provided in UserDal::updateBalance()."));
            }

            var updateObject = {
                $set: {
                    "balance": balance
                }
            };

            this.getDataStore().updateObject(this.getCollectionName(), {"_id": userId}, updateObject)
                .then(resolve)
                .catch(reject);
        });
    }
}

export = UserDal;