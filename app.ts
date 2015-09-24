/// <reference path="typings/tsd.d.ts" />

import express = require("express");
import passport = require("passport");
import passportLocal = require("passport-local");
import passportJWT = require("passport-jwt");

import Database = require("./database/Database");
import HashFactory = require("./factories/HashFactory");
import TransactionDal = require("./database/TransactionDal");
import TransactionFactory = require("./factories/TransactionFactory");
import UserDal = require("./database/UserDal");

var bodyParser = require("body-parser");
var transactions = require("./routes/transactions");
var users = require("./routes/users");

var database: FinancialPlanning.Server.Database.IDatabase = new Database();
var userDal: UserDal = new UserDal(database);
var transactionDal: TransactionDal = new TransactionDal(database);

// App setup
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());

/**
 * This will add the global database object onto all requests
 * TODO maybe limit to requests that need it?
 */
app.use((request: express.Request, response: express.Response, next: Function) =>
{
    request.database = database;
    next();
});

/**
 * Strategy for logging in
 */
passport.use(new passportLocal.Strategy((username: string, password: string, done: Function) =>
{
    userDal.getUser(username)
        .then((user: FinancialPlanning.Server.Users.IUser) =>
        {
            return HashFactory.checkHash(password, user.hash)
                .then((verified: boolean) =>
                {
                    if (!verified)
                    {
                        return done(null, false);
                    }
                    else
                    {
                        return done(null, user);
                    }
                });
        })
        .catch((err: any) =>
        {
            return done(null, false, {message: "Could not verify user"});
        });
}));

var options: passportJWT.IJwtStrategyOptions = {
    secretOrKey: "3CF5434AE17036B3F0D32F67AAF9F875F35E0498F1D78F335625BA19E5C38592",
    passReqToCallback: true
};

/**
 * Strategy for validating requests with a json-web-token
 */
passport.use(new passportJWT.Strategy(options, (request: express.Request, jwt_payload: any, done: Function) =>
{
    userDal.getUser(jwt_payload._id)
        .then((user: FinancialPlanning.Server.Users.IUser) =>
        {
            return done(null, user);
        })
        .catch((error: any) =>
        {
            return done(error);
        });
}));

app.use('/users', users);
app.use('/transactions', transactions);

var server = app.listen(3000);