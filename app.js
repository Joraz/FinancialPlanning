/// <reference path="typings/tsd.d.ts" />
var express = require("express");
var passport = require("passport");
var passportLocal = require("passport-local");
var passportJWT = require("passport-jwt");
var Database = require("./database/Database");
var HashFactory = require("./factories/HashFactory");
var TransactionDal = require("./database/TransactionDal");
var UserDal = require("./database/UserDal");
var bodyParser = require("body-parser");
var transactions = require("./routes/transactions");
var users = require("./routes/users");
var database = new Database();
var userDal = new UserDal(database);
var transactionDal = new TransactionDal(database);
// App setup
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
/**
 * This will add the global database object onto all requests
 * TODO maybe limit to requests that need it?
 */
app.use(function (request, response, next) {
    request.database = database;
    next();
});
/**
 * Strategy for logging in
 */
passport.use(new passportLocal.Strategy(function (username, password, done) {
    userDal.getUser(username)
        .then(function (user) {
        return HashFactory.checkHash(password, user.hash)
            .then(function (verified) {
            if (!verified) {
                return done(null, false);
            }
            else {
                return done(null, user);
            }
        });
    })
        .catch(function (err) {
        return done(null, false, { message: "Could not verify user" });
    });
}));
var options = {
    secretOrKey: "3CF5434AE17036B3F0D32F67AAF9F875F35E0498F1D78F335625BA19E5C38592",
    passReqToCallback: true
};
/**
 * Strategy for validating requests with a json-web-token
 */
passport.use(new passportJWT.Strategy(options, function (request, jwt_payload, done) {
    userDal.getUser(jwt_payload._id)
        .then(function (user) {
        return done(null, user);
    })
        .catch(function (error) {
        return done(error);
    });
}));
app.use('/users', users);
app.use('/transactions', transactions);
var server = app.listen(3000);
//# sourceMappingURL=app.js.map