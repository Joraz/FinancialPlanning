/// <reference path="typings/tsd.d.ts" />
var express = require("express");
var passport = require("passport");
var passportLocal = require("passport-local");
var passportJWT = require("passport-jwt");
var Database = require("./database/Database");
var HashProvider = require("./security/HashProvider");
var UserDal = require("./database/UserDal");
var bodyParser = require("body-parser");
var transactions = require("./routes/transactions");
var users = require("./routes/users");
var database = new Database();
var userDal = new UserDal(database);
var JWTStrategy = passportJWT.Strategy;
var LocalStrategy = passportLocal.Strategy;
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
//Strategy for logging in. After this the client will need to include a json-web-token to authenticate
passport.use(new LocalStrategy(function (username, password, done) {
    userDal.getUser(username).then(function (user) {
        return HashProvider.checkHash(password, user.hash).then(function (verified) {
            if (!verified) {
                return done(null, false);
            }
            else {
                return done(null, user);
            }
        });
    }).catch(function (err) {
        if (err && err.indexOf("No item found") !== -1) {
            return done(null, false);
        }
        else {
            return done(err);
        }
    });
}));
var options = {
    secretOrKey: "3CF5434AE17036B3F0D32F67AAF9F875F35E0498F1D78F335625BA19E5C38592"
};
passport.use(new JWTStrategy(options, function (jwt_payload, done) {
    return done(null, jwt_payload._id);
}));
app.use('/users', users);
app.use('/transactions', transactions);
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://" + host + ":" + port);
});
//# sourceMappingURL=app.js.map