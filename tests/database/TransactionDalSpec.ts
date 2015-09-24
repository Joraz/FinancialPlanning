///// <reference path="../../typings/tsd.d.ts" />
//
//import chai = require("chai");
//import moment = require("moment");
//
//import Database = require("../../database/Database");
//import FinancialPlanning = require("financial-planning");
//import TransactionDal = require("../../database/TransactionDal");
//
//var database: FinancialPlanning.Server.Database.IDatabase;
//var transactionDal: TransactionDal;
//
//describe("TransactionDal", () =>
//{
//    before(() =>
//    {
//        database = new Database();
//        transactionDal = new TransactionDal(database, "transaction-test");
//    });
//
//    after(() =>
//    {
//        return database.deleteCollection("transaction-test")
//            .then(() =>
//            {
//                return database.close();
//            });
//    });
//
//    describe("getTransaction", () =>
//    {
//        describe("When called with invalid parameters", () =>
//        {
//            describe("When called with a null 'transactionId' parameter", () =>
//            {
//                it("should return a promise that is rejected with an error", () =>
//                {
//                    return transactionDal.getTransaction(null)
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("No 'transactionId' parameter provided in TransactionDal::getTransaction().");
//                        });
//                });
//            });
//
//            describe("When called with an empty string 'transactionId' parameter", () =>
//            {
//                it("should return a promise that is rejected with an error", () =>
//                {
//                    return transactionDal.getTransaction("")
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("No 'transactionId' parameter provided in TransactionDal::getTransaction().");
//                        });
//                });
//            });
//        });
//
//        describe("When called with valid parameters", () =>
//        {
//            describe("When the transaction does not exist in the datastore", () =>
//            {
//                it("should return a promise that is rejected with an error", () =>
//                {
//                    return transactionDal.getTransaction("does-not-exist")
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal('No item found using match: {"_id":"does-not-exist"}');
//                        })
//                });
//            });
//
//            describe("When the transaction does exist in the datastore", () =>
//            {
//                before(() =>
//                {
//                    var transaction: FinancialPlanning.Common.Transactions.INonRecurringTransaction = {
//                        _id: "test-transaction-one",
//                        user: "test-user-one",
//                        adjustment: 456,
//                        transactionTypeId: "test-transaction-type-one",
//                        transactionDate: new Date()
//                    };
//
//                    return database.writeObject("transaction-test", transaction);
//                });
//
//                it("should return the transaction", () =>
//                {
//                    return transactionDal.getTransaction("test-transaction-one")
//                        .then((response: FinancialPlanning.Common.Transactions.ITransaction) =>
//                        {
//                            chai.expect(response).to.not.be.undefined;
//                            chai.expect(response.adjustment).to.equal(456);
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.be.undefined;
//                        });
//                });
//            });
//        });
//    });
//
//    describe("getTransactionsForUser", () =>
//    {
//        describe("When called with invalid parameters", () =>
//        {
//            describe("When called with a null 'userId' parameter", () =>
//            {
//                it("should return a promise that is rejected with an error", () =>
//                {
//                    return transactionDal.getTransactionsForUser(null)
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("No 'userId' parameter provided in TransactionDal::getTransactionsForUser().");
//                        });
//                });
//            });
//
//            describe("When called with an empty string 'userId' parameter", () =>
//            {
//                it("should return a promise that is rejected with an error", () =>
//                {
//                    return transactionDal.getTransactionsForUser("")
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("No 'userId' parameter provided in TransactionDal::getTransactionsForUser().");
//                        });
//                });
//            });
//        });
//
//        describe("When called with valid parameters", () =>
//        {
//            describe("When there are no transactions", () =>
//            {
//                it("should return an empty array", () =>
//                {
//                    return transactionDal.getTransactionsForUser("no-transactions")
//                        .then((response: Array<FinancialPlanning.Common.Transactions.ITransaction>) =>
//                        {
//                            chai.expect(response).to.not.be.undefined;
//                            chai.expect(response).to.deep.equal([]);
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.be.undefined;
//                        });
//                });
//            });
//
//            describe("When there are transactions", () =>
//            {
//                before((done) =>
//                {
//                    var transactions = dataProvider.getRecurringAndNonRecurringTransactions(10);
//                    var promises = [];
//                    transactions.forEach((transaction: FinancialPlanning.Common.Transactions.ITransaction) =>
//                    {
//                        promises.push(database.writeObject("transaction-test", transaction));
//                    });
//                    Promise.all(promises)
//                        .then(() =>
//                        {
//                            done();
//                        });
//                });
//
//                describe("When called without start or end date parameters", () =>
//                {
//                    it("should return all transactions for that user", () =>
//                    {
//                        return transactionDal.getTransactionsForUser("test-user")
//                            .then((response: Array<FinancialPlanning.Common.Transactions.ITransaction>) =>
//                            {
//                                chai.expect(response).to.not.be.undefined;
//                                chai.expect(response.length).to.equal(8);
//                            })
//                            .catch((error: any) =>
//                            {
//                                chai.expect(error).to.be.undefined;
//                            });
//                    });
//                });
//
//                describe("When called with a start date parameter", () =>
//                {
//                    it("should return all transactions from after that date", () =>
//                    {
//                        return transactionDal.getTransactionsForUser("test-user", moment().subtract(2, "month").toDate())
//                            .then((response: Array<FinancialPlanning.Common.Transactions.ITransaction>) =>
//                            {
//                                chai.expect(response).to.not.be.undefined;
//                                chai.expect(response.length).to.equal(4);
//                            })
//                            .catch((error: any) =>
//                            {
//                                chai.expect(error).to.be.undefined;
//                            });
//                    });
//                });
//
//                describe("When called with an end date parameter", () =>
//                {
//                    it("should return all transactions from before that date", () =>
//                    {
//                        return transactionDal.getTransactionsForUser("test-user", null, moment().add(2, "month").toDate())
//                            .then((response: Array<FinancialPlanning.Common.Transactions.ITransaction>) =>
//                            {
//                                chai.expect(response).to.not.be.undefined;
//                                chai.expect(response.length).to.equal(7);
//                            })
//                            .catch((error: any) =>
//                            {
//                                chai.expect(error).to.be.undefined;
//                            });
//                    });
//                });
//
//                describe("When called with start and end date parameters", () =>
//                {
//                    it("should return all transactions between the two dates", () =>
//                    {
//                        return transactionDal.getTransactionsForUser("test-user",
//                            moment().subtract(2, "month").toDate(),
//                            moment().add(2, "month").toDate())
//                            .then((response: Array<FinancialPlanning.Common.Transactions.ITransaction>) =>
//                            {
//                                chai.expect(response).to.not.be.undefined;
//                                chai.expect(response.length).to.equal(3);
//                            })
//                            .catch((error: any) =>
//                            {
//                                chai.expect(error).to.be.undefined;
//                            });
//                    });
//                });
//            });
//        });
//    });
//
//    describe("createTransaction", () =>
//    {
//        describe("When called with invalid parameters", () =>
//        {
//            describe("When called with a null 'transaction' parameter", () =>
//            {
//                it("should return a promise that is rejected with an error", () =>
//                {
//                    return transactionDal.createTransaction(null)
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("No 'transaction' parameter provided in TransactionDal::createTransaction().");
//                        });
//                });
//            });
//        });
//
//        describe("When called with valid parameters", () =>
//        {
//            it("should insert the transaction into the datastore", () =>
//            {
//                var transaction: FinancialPlanning.Common.Transactions.IRecurringTransaction = {
//                    user: "test-user-three",
//                    adjustment: -5.99,
//                    transactionTypeId: "test-transaction-type-one",
//                    transactionData: [
//                        {
//                            dueDate: new Date()
//                        }
//                    ],
//                    startDate: new Date(),
//                    active: true
//                };
//
//                return transactionDal.createTransaction(transaction)
//                .then((response: FinancialPlanning.Common.Transactions.ITransaction) =>
//                    {
//                        chai.expect(response).to.not.be.undefined;
//                        chai.expect(response._id).to.not.be.undefined;
//
//                        return transactionDal.getTransaction(response._id);
//                    })
//                    .then((response: FinancialPlanning.Common.Transactions.ITransaction) =>
//                    {
//                        chai.expect(response).to.not.be.undefined;
//                        chai.expect(response.adjustment).to.equal(-5.99);
//                    })
//                .catch((error: any) =>
//                    {
//                        chai.expect(error).to.be.undefined;
//                    })
//            });
//        });
//    });
//
//    describe("deleteTransaction", () =>
//    {
//        describe("When called with invalid parameters", () =>
//        {
//            describe("When called with a null 'transactionId' parameter", () =>
//            {
//                it("should return a promise that is rejected with an error", () =>
//                {
//                    return transactionDal.deleteTransaction(null)
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("No 'transactionId' parameter provided in TransactionDal::deleteTransaction().");
//                        });
//                });
//            });
//
//            describe("When called with an empty string 'transactionId' parameter", () =>
//            {
//                it("should return a promise that is rejected with an error", () =>
//                {
//                    return transactionDal.deleteTransaction("")
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("No 'transactionId' parameter provided in TransactionDal::deleteTransaction().");
//                        });
//                });
//            });
//        });
//
//        describe("When called with valid parameters", () =>
//        {
//            describe("When the transaction exists in the datastore", () =>
//            {
//                before(() =>
//                {
//                    var transaction: FinancialPlanning.Common.Transactions.INonRecurringTransaction = {
//                        _id: "test-transaction-id-one",
//                        user: "test-user-one",
//                        adjustment: 59.99,
//                        transactionTypeId: "test-transaction-type-one",
//                        transactionDate: new Date()
//                    };
//
//                    return database.writeObject("transaction-test", transaction);
//                });
//
//                it("should delete that user", () =>
//                {
//                    return transactionDal.deleteTransaction("test-transaction-id-one")
//                        .then((response: string) =>
//                        {
//                            chai.expect(response).to.not.be.undefined;
//                            chai.expect(response).to.equal("Success");
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.be.undefined;
//                        });
//                });
//            });
//
//            describe("When the transaction does not exist in the datastore", () =>
//            {
//                it("should return a promise that is rejected with an error", () =>
//                {
//                    return transactionDal.deleteTransaction("does-not-exist")
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("Could not delete transaction does-not-exist");
//                        });
//                });
//            });
//        });
//    });
//
//    describe("toggleRecurringTransactionStatus", () =>
//    {
//        describe("When called with invalid parameters", () =>
//        {
//            describe("When called with a null 'transactionId' parameter", () =>
//            {
//                it("should return a promise that is resolved with an error", () =>
//                {
//                    return transactionDal.toggleRecurringTransactionStatus(null)
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("No 'transactionId' parameter provided in TransactionDal::toggleRecurringTransactionStatus().");
//                        });
//                });
//            });
//
//            describe("When called with an empty string 'transactionId' parameter", () =>
//            {
//                it("should return a promise that is resolved with an error", () =>
//                {
//                    return transactionDal.toggleRecurringTransactionStatus("")
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("No 'transactionId' parameter provided in TransactionDal::toggleRecurringTransactionStatus().");
//                        });
//                });
//            });
//        });
//
//        describe("When called with valid parameters", () =>
//        {
//            describe("When the transactionId provided does not match any in the datastore", () =>
//            {
//                it("should return a promise that is resolved with an error", () =>
//                {
//                    return transactionDal.toggleRecurringTransactionStatus("does-not-exist")
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal('No item found using match: {"_id":"does-not-exist"}');
//                        });
//                });
//            });
//
//            describe("When the transactionId provided does match a transaction in the datastore", () =>
//            {
//                describe("When the transaction is non-recurring", () =>
//                {
//                    before(() =>
//                    {
//                        var transaction: FinancialPlanning.Common.Transactions.INonRecurringTransaction = {
//                            _id: "test-transaction-nine",
//                            user: "test-user",
//                            adjustment: -4.99,
//                            transactionTypeId: "test-transaction-type-one",
//                            transactionDate: new Date()
//                        };
//
//                        return database.writeObject("transaction-test", transaction);
//                    });
//
//                    it("should return a promise that is resolved with an error", () =>
//                    {
//                        return transactionDal.toggleRecurringTransactionStatus("test-transaction-nine")
//                            .then((response: any) =>
//                            {
//                                chai.expect(response).to.be.undefined;
//                            })
//                            .catch((error: any) =>
//                            {
//                                chai.expect(error).to.not.be.undefined;
//                                chai.expect(error.message).to.equal("Supplied transaction ID is not a recurring transaction");
//                            });
//                    });
//                });
//
//                describe("When the transaction is recurring", () =>
//                {
//                    describe("When the active status is set to true", () =>
//                    {
//                        before(() =>
//                        {
//                            var transaction: FinancialPlanning.Common.Transactions.IRecurringTransaction = {
//                                _id: "test-transaction-ten",
//                                user: "test-user",
//                                adjustment: -19.99,
//                                transactionTypeId: "test-transaction-type-one",
//                                transactionData: [],
//                                startDate: new Date(),
//                                active: true
//                            };
//
//                            return database.writeObject("transaction-test", transaction);
//                        });
//
//                        it("should set the status to false", () =>
//                        {
//                            return transactionDal.toggleRecurringTransactionStatus("test-transaction-ten")
//                                .then((response: FinancialPlanning.Common.Transactions.IRecurringTransaction) =>
//                                {
//                                    chai.expect(response).to.not.be.undefined;
//                                    chai.expect(response._id).to.equal("test-transaction-ten");
//                                    chai.expect(response.active).to.be.false;
//                                })
//                                .catch((error: any) =>
//                                {
//                                    chai.expect(error).to.be.undefined;
//                                });
//                        });
//                    });
//
//                    describe("When the active status is set to false", () =>
//                    {
//                        before(() =>
//                        {
//                            var transaction: FinancialPlanning.Common.Transactions.IRecurringTransaction = {
//                                _id: "test-transaction-eleven",
//                                user: "test-user",
//                                adjustment: 39.95,
//                                transactionTypeId: "test-transaction-type-one",
//                                transactionData: [],
//                                startDate: new Date(),
//                                active: false
//                            };
//
//                            return database.writeObject("transaction-test", transaction);
//                        });
//
//                        it("should set the status to true", () =>
//                        {
//                            return transactionDal.toggleRecurringTransactionStatus("test-transaction-eleven")
//                                .then((response: FinancialPlanning.Common.Transactions.IRecurringTransaction) =>
//                                {
//                                    chai.expect(response).to.not.be.undefined;
//                                    chai.expect(response._id).to.equal("test-transaction-eleven");
//                                    chai.expect(response.active).to.be.true;
//                                })
//                                .catch((error: any) =>
//                                {
//                                    chai.expect(error).to.be.undefined;
//                                });
//                        });
//                    });
//                });
//            });
//        });
//    });
//});