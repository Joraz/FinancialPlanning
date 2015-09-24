/// <reference path="../../typings/tsd.d.ts" />

import chai = require("chai");
import moment = require("moment");
import _ = require("underscore");

import TransactionUtilities = require("../../utilities/TransactionUtilities");
import UuidUtilities = require("../../utilities/UuidUtilities");

describe("TransactionUtilities", () =>
{
    describe("applyTransactionsToBalance", () =>
    {
        describe("When called with a null 'transactionInstances' parameter", () =>
        {
            it("should throw an error", () =>
            {
                chai.expect(() =>
                {
                    var x = TransactionUtilities.applyTransactionsToBalance(null, null);
                }).to.throw("No 'transactionInstances' parameter specified in TransactionUtilities::applyTransactionsToBalance().");
            });
        });

        describe("When called with a null 'balance' parameter", () =>
        {
            it("should throw an error", () =>
            {
                chai.expect(() =>
                {
                    var x = TransactionUtilities.applyTransactionsToBalance([], null);
                }).to.throw("No 'balance' parameter specified in TransactionUtilities::applyTransactionsToBalance().");
            });
        });

        describe("When called with a valid 'balance' parameter and an empty array", () =>
        {
            it("should not change the array or the balance", () =>
            {
                var balance = 555;
                var transactionInstances = [];

                TransactionUtilities.applyTransactionsToBalance(transactionInstances, balance);
                chai.expect(balance).to.equal(555);
                chai.expect(transactionInstances).to.deep.equal([]);
            });
        });

        describe("When called with a valid 'balance' parameter and an array of transactionInstances", () =>
        {
            it("should apply any due transactions that have not been processed to the balance, and mark them as processed", () =>
            {
                var transactionInstances: Array<FinancialPlanning.Common.Transactions.ITransactionInstance> = [
                    {
                        _id: "test-transaction-instance-one",
                        transactionTypeId: "test-transaction-type-one",
                        userId: "test-user",
                        startDate: moment().subtract(2, "month").subtract(2, "day").toDate(),
                        adjustment: 46.99,
                        transactions: [
                            {
                                _id: UuidUtilities.createNewMongodbId(),
                                processed: true,
                                transactionDate: moment().subtract(2, "month").subtract(2, "day").toDate(),
                                processedDate: moment().subtract(2, "month").subtract(2, "day").toDate()
                            },
                            {
                                _id: UuidUtilities.createNewMongodbId(),
                                processed: false,
                                transactionDate: moment().subtract(1, "month").subtract(2, "day").toDate(),
                            },
                            {
                                _id: UuidUtilities.createNewMongodbId(),
                                processed: false,
                                transactionDate: moment().subtract(2, "day").toDate()
                            }
                        ]
                    },
                    {
                        _id: "test-transaction-instance-two",
                        transactionTypeId: "test-transaction-type-two",
                        userId: "test-user",
                        startDate: moment().add(3, "day").toDate(),
                        adjustment: -9.99,
                        transactions: [
                            {
                                _id: UuidUtilities.createNewMongodbId(),
                                processed: false,
                                transactionDate: moment().add(3, "day").toDate()
                            }
                        ]
                    },
                    {
                        _id: "test-transaction-instance-three",
                        transactionTypeId: "test-transaction-type-three",
                        userId: "test-user",
                        startDate: moment().subtract(6, "day").toDate(),
                        adjustment: -19.99,
                        transactions: [
                            {
                                _id: UuidUtilities.createNewMongodbId(),
                                processed: true,
                                transactionDate: moment().subtract(6, "day").toDate(),
                                processedDate: moment().toDate()
                            }
                        ]
                    },
                    {
                        _id: "test-transaction-instance-four",
                        transactionTypeId: "test-transaction-type-four",
                        userId: "test-user",
                        startDate: moment().toDate(),
                        adjustment: -59.95,
                        transactions: [
                            {
                                _id: UuidUtilities.createNewMongodbId(),
                                processed: false,
                                transactionDate: moment().toDate()
                            }
                        ]
                    }
                ];

                var balance = 0;
                var newBalance = TransactionUtilities.applyTransactionsToBalance(transactionInstances, balance);
                chai.expect(newBalance).to.equal(34.03);
                chai.expect(transactionInstances[0].transactions[2].processed).to.be.true;
            });
        });
    });

    describe("filterTransactionTypesByUser", () =>
    {
        var transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType> = [
            {
                _id: "54646d35-113e-48db-8083-9e7317e63e6a",
                paymentDirection: "outgoing",
                name: "gas bill",
                classification: "Utilities",
                subClassification: "Gas",
                isDefault: true,
                isTaxable: false
            },
            {
                _id: "3d16f0e5-0f10-4f90-8240-c621fd5d0299",
                paymentDirection: "incoming",
                name: "tax credit",
                classification: "Benefits",
                subClassification: "Child Tax Credit",
                userId: "test-user-one",
                isDefault: false,
                isTaxable: false
            },
            {
                _id: "37081595-b5a5-45dd-80ec-8686b67e3f00",
                paymentDirection: "outgoing",
                name: "electricity",
                classification: "Utilities",
                subClassification: "Electricity",
                isDefault: true,
                isTaxable: false
            },
            {
                _id: "050b83fa-8fa3-4726-8440-02b0556c2b87",
                paymentDirection: "incoming",
                name: "salary",
                classification: "Work",
                subClassification: "Pay",
                userId: "test-user-two",
                isDefault: false,
                isTaxable: true
            }
        ];

        describe("When called with a null 'transactionType' parameter", () =>
        {
            it("should throw an error", () =>
            {
                chai.expect(() =>
                {
                    var x = TransactionUtilities.filterTransactionTypesByUser(null);
                }).to.throw("No 'transactionTypes' parameter provided in TransactionUtilities::filterTransactionTypesByUser().");
            });
        });

        describe("When called without a 'userId' parameter", () =>
        {
            it("should return an array with all transaction types removed that have a 'user' property", () =>
            {
                var filtered = TransactionUtilities.filterTransactionTypesByUser(transactionTypes);
                chai.expect(filtered.length).to.equal(2);
                chai.expect(filtered[0]._id).to.equal("54646d35-113e-48db-8083-9e7317e63e6a");
                chai.expect(filtered[1]._id).to.equal("37081595-b5a5-45dd-80ec-8686b67e3f00");
            });
        });

        describe("When called with a 'userId' parameter", () =>
        {
            describe("When the userId matches the user property", () =>
            {
                it("should return that transaction type", () =>
                {
                    var filtered = TransactionUtilities.filterTransactionTypesByUser(transactionTypes, "test-user-one");
                    chai.expect(filtered.length).to.equal(3);
                    chai.expect(filtered[0]._id).to.equal("54646d35-113e-48db-8083-9e7317e63e6a");
                    chai.expect(filtered[1]._id).to.equal("3d16f0e5-0f10-4f90-8240-c621fd5d0299");
                    chai.expect(filtered[2]._id).to.equal("37081595-b5a5-45dd-80ec-8686b67e3f00");
                });
            });

            describe("When the userId does not match the user property", () =>
            {
                it("should not return that transaction type", () =>
                {
                    var filtered = TransactionUtilities.filterTransactionTypesByUser(transactionTypes, "test-user-one");
                    filtered.forEach((transaction: FinancialPlanning.Common.Transactions.ITransactionType) =>
                    {
                        chai.expect(transaction._id).to.not.equal("050b83fa-8fa3-4726-8440-02b0556c2b87");
                    })
                });
            });
        })
    });

    describe("createTransactionsForNewRecurringInstance", () =>
    {
        describe("When called with invalid parameters", () =>
        {
            describe("When called with a null 'fromDate'", () =>
            {
                it("should throw an error", () =>
                {
                    chai.expect(() =>
                    {
                        var x = TransactionUtilities.createTransactionsForNewRecurringInstance(null);
                    }).to.throw("No 'fromDate' parameter provided in TransactionUtilities::createTransactionsForNewRecurringInstance().");
                });
            });
        });

        describe("When called with valid parameters", () =>
        {
            describe("When called with a fromDate more than a month in the past", () =>
            {
                it("should return an array of transactions, one for each full month between the fromDate and now", () =>
                {
                    var transactions = TransactionUtilities.createTransactionsForNewRecurringInstance(moment().subtract(4, "month").subtract(3, "day").toDate());
                    chai.expect(transactions).to.have.lengthOf(5);
                });
            });

            describe("When called with a fromDate less than a full month in the past", () =>
            {
                it("should return an array of one transaction", () =>
                {
                    var transactions = TransactionUtilities.createTransactionsForNewRecurringInstance(moment().subtract(3, "day").toDate());
                    chai.expect(transactions).to.have.lengthOf(1);
                });
            });

            describe("When called with a fromDate in the future", () =>
            {
                it("should return an array of one transaction", () =>
                {
                    var transactions = TransactionUtilities.createTransactionsForNewRecurringInstance(moment().add(4, "day").add(1, "month").toDate());
                    chai.expect(transactions).to.have.lengthOf(1);
                });
            });
        });
    });

    describe("bringRecurringTransactionUpToDate", () =>
    {
        describe("When called with invalid parameters", () =>
        {
            describe("When given a null 'transactionInstance' parameter", () =>
            {
                it("should throw an error", () =>
                {
                    chai.expect(() =>
                    {
                        var x = TransactionUtilities.bringRecurringTransactionUpToDate(null);
                    }).to.throw("No 'transactionInstance' parameter provided in TransactionUtilities::bringRecurringTransactionUpToDate().");
                });
            });
        });

        describe("When called with valid parameters", () =>
        {
            describe("When the transaction is not active", () =>
            {
                it("should return the transaction unchanged", () =>
                {
                    var recurringTransactionInstance: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance = {
                        _id: "test-transaction-one",
                        transactionTypeId: "test-transaction-type-one",
                        userId: "test-user",
                        startDate: new Date(),
                        adjustment: -4.99,
                        transactions: [],
                        isActive: false
                    };

                    var upToDateTransaction = TransactionUtilities.bringRecurringTransactionUpToDate(recurringTransactionInstance);
                    chai.expect(upToDateTransaction).to.deep.equal(recurringTransactionInstance);
                });
            });

            describe("When the transaction instance has no transactions on it", () =>
            {
                it("should throw an error", () =>
                {
                    var recurringTransactionInstance: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance = {
                        _id: "test-transaction-two",
                        transactionTypeId: "test-transaction-type-one",
                        userId: "test-user",
                        startDate: new Date(),
                        adjustment: -4.99,
                        transactions: [],
                        isActive: true
                    };

                    chai.expect(() =>
                    {
                        var x = TransactionUtilities.bringRecurringTransactionUpToDate(recurringTransactionInstance);
                    }).to.throw("Could not bring transactionInstance 'test-transaction-two' up to date. Fatal error encountered.");
                });
            });

            describe("When the transaction instance only has unprocessed transactions", () =>
            {
                it("should return the transaction unchanged", () =>
                {
                    var recurringTransactionInstance: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance = {
                        _id: "test-transaction-three",
                        transactionTypeId: "test-transaction-type-one",
                        userId: "test-user",
                        startDate: moment().add(1, "month").toDate(),
                        adjustment: -4.99,
                        transactions: [
                            {
                                _id: UuidUtilities.createNewMongodbId(),
                                processed: false,
                                transactionDate: moment().add(1, "month").toDate()
                            }
                        ],
                        isActive: true
                    };

                    var updatedTransaction = TransactionUtilities.bringRecurringTransactionUpToDate(recurringTransactionInstance);
                    chai.expect(updatedTransaction).to.deep.equal(recurringTransactionInstance);
                });
            });

            describe("When the transaction instance has at least one processed transaction", () =>
            {
                describe("When the processed transaction has a transactionDate of at least over a month ago", () =>
                {
                    it("should add in unprocessed transactions to bring it up to date", () =>
                    {
                        var recurringTransactionInstance: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance = {
                            _id: "test-transaction-four",
                            transactionTypeId: "test-transaction-type-one",
                            userId: "test-user",
                            startDate: moment().subtract(4, "month").subtract(3, "day").toDate(),
                            adjustment: -4.99,
                            transactions: [
                                {
                                    _id: UuidUtilities.createNewMongodbId(),
                                    processed: true,
                                    transactionDate: moment().subtract(4, "month").subtract(3, "day").toDate()
                                },
                                {
                                    _id: UuidUtilities.createNewMongodbId(),
                                    processed: true,
                                    transactionDate: moment().subtract(3, "month").subtract(3, "day").toDate()
                                }
                            ],
                            isActive: true
                        };

                        var updatedTransaction = TransactionUtilities.bringRecurringTransactionUpToDate(recurringTransactionInstance);
                        chai.expect(updatedTransaction.transactions).to.have.lengthOf(5);
                    });
                });

                describe("When the processed transaction has a transactionDate of under a month ago", () =>
                {
                    it("should return the transaction unchanged", () =>
                    {
                        var recurringTransactionInstance: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance = {
                            _id: "test-transaction-five",
                            transactionTypeId: "test-transaction-type-one",
                            userId: "test-user",
                            startDate: moment().subtract(2, "month").subtract(3, "day").toDate(),
                            adjustment: -4.99,
                            transactions: [
                                {
                                    _id: UuidUtilities.createNewMongodbId(),
                                    processed: true,
                                    transactionDate: moment().subtract(2, "month").subtract(3, "day").toDate()
                                },
                                {
                                    _id: UuidUtilities.createNewMongodbId(),
                                    processed: true,
                                    transactionDate: moment().subtract(1, "month").subtract(3, "day").toDate()
                                },
                                {
                                    _id: UuidUtilities.createNewMongodbId(),
                                    processed: true,
                                    transactionDate: moment().subtract(3, "day").toDate()
                                }
                            ],
                            isActive: true
                        };

                        var updatedTransaction = TransactionUtilities.bringRecurringTransactionUpToDate(recurringTransactionInstance);
                        chai.expect(updatedTransaction).to.deep.equal(recurringTransactionInstance);
                    });
                });
            });
        });
    });
});