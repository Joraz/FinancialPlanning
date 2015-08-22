/// <reference path="../typings/tsd.d.ts" />

import express = require("express");
import passport = require("passport");
import passportJWT = require("passport-jwt");

import TransactionDal = require("../database/TransactionDal");

var router: express.Router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), (request: express.Request, response: express.Response) =>
{
    var db = request.database;
    var transactionDal = new TransactionDal(db);

    transactionDal.getTransactionsForUser(request.user)
        .then((databaseResponse: Array<FinancialPlanning.Transactions.ITransaction>) =>
        {
            console.log(databaseResponse);
            return response.status(200).send(databaseResponse);
        })
        .catch((error: any) =>
        {
            return response.status(500).send(error);
        });
});

module.exports = router;