/// <reference path="typings/tsd.d.ts" />

// import 3rd party modules
import express = require("express");
import passport = require("passport");
import passportLocal = require("passport-local");
import passportJWT = require("passport-jwt");

// import application modules
import Database = require("./database/Database");
import HashFactory = require("./factories/HashFactory");
import TransactionDal = require("./database/TransactionDal");
import TransactionFactory = require("./factories/TransactionFactory");
import UserDal = require("./database/UserDal");

// import the body-parser for request
var bodyParser = require("body-parser");

// import the exported routes for the application
var transactions = require("./routes/transactions");
var users = require("./routes/users");

// create the global database object
var database: FinancialPlanning.Server.Database.IDatabase = new Database();
var userDal: UserDal = new UserDal(database);

// App setup
var app = express();

// set application options
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());

/**
 * This middleware will add the global database object onto all requests
 */
app.use((request: express.Request, response: express.Response, next: Function) =>
{
    request.database = database;
    next();
});

/**
 * Strategy for logging in with username & password
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

// JWT strategy options
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

// Use the imported routes
app.use('/users', users);
app.use('/transactions', transactions);

// Run the server
var server = app.listen(3000);