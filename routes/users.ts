/// <reference path="../typings/tsd.d.ts" />

import express = require("express");
import passport = require("passport");

import HashProvider = require("../security/HashProvider");
import TokenProvider = require("../security/TokenProvider");
import UserDal = require("../database/UserDal");

var router: express.Router = express.Router();

/**
 * Create a new user. Will return a jsonwebtoken
 */
router.post('/', (request: express.Request, response: express.Response) =>
{
    var username = request.body.username;
    var password = request.body.password;

    if (!username)
    {
        return response.status(400).send("No Username provided");
    }

    if (!password)
    {
        return response.status(400).send("No Password provided");
    }

    HashProvider.createHash(password)
        .then((passwordHash: FinancialPlanning.Security.IPasswordHash) =>
        {
            var user: FinancialPlanning.Users.IUser = {
                _id: username,
                hash: passwordHash.hash,
                salt: passwordHash.salt
            };

            var userDal = new UserDal(request.database);

            userDal.createUser(user)
                .then((databaseResponse: any) =>
                {
                    if (databaseResponse["ok"] !== null)
                    {
                        var jwt: string = TokenProvider.generateJWT(user);
                        return response.status(200).send(jwt);
                    }
                    else
                    {
                        return response.status(500).send("Could not create new user");
                    }
                });
        })
        .catch((error: Error) =>
        {
            return response.status(500).send(error.message);
        });
});

/**
 * Login for user
 */
router.post('/login', passport.authenticate('local', {session: false}), (request: express.Request, response: express.Response) =>
{
    var jwt: string = TokenProvider.generateJWT(request.user);
    return response.status(200).send(jwt);
});

/**
 * Update password for a user
 */
router.post('/updatePassword', passport.authenticate('jwt', {session: false}), (request: express.Request, response: express.Response) =>
{
    var password = request.body.password;

    if (!password)
    {
        return response.status(400).send("No Password provided");
    }

    HashProvider.createHash(password)
        .then((hashResponse: FinancialPlanning.Security.IPasswordHash) =>
        {
            var database = request.database;
            var userDal = new UserDal(database);
            var userId = request.user;

            userDal.updatePassword(userId, hashResponse.hash, hashResponse.salt)
                .then((databaseResponse: any) =>
                {
                    if (databaseResponse["ok"] !== null)
                    {
                        var user: FinancialPlanning.Users.IUser = databaseResponse.value;
                        var jwt = TokenProvider.generateJWT(user);
                        return response.status(200).send(jwt);
                    }
                    else
                    {
                        return response.status(500).send("Could not change password");
                    }
                });
        })
        .catch((error: any) =>
        {
            return response.status(500).send(error.message);
        });
});

router.delete('/', passport.authenticate('jwt', {session: false}), (request: express.Request, response: express.Response) =>
{
    var database = request.database;
    var userDal = new UserDal(database);
    var userId = request.user;

    userDal.deleteUser(userId)
        .then((databaseResponse: any) =>
        {
            if (databaseResponse.result && databaseResponse.result.n && databaseResponse.result.n > 0)
            {
                return response.status(200).send({});
            }
            else
            {
                return response.status(500).send("Could not delete user");
            }
        })
        .catch((error: any) =>
        {
            return response.status(500).send(error.message);
        });
});

module.exports = router;