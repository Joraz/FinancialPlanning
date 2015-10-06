/// <reference path="../../typings/tsd.d.ts" />
var chai = require("chai");
var moment = require("moment");
var TransactionFactory = require("../../factories/TransactionFactory");
describe("TransactionFactory", function () {
    describe("createNewTransactionType", function () {
        describe("When called with invalid mandatory parameters", function () {
            describe("When called with a null 'name' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionType(null, null, null, null, null);
                    }).to.throw("No 'name' parameter provided in TransactionFactory::createNewTransactionType().");
                });
            });
            describe("When called with an empty string 'name' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionType("", null, null, null, null);
                    }).to.throw("No 'name' parameter provided in TransactionFactory::createNewTransactionType().");
                });
            });
            describe("When called with a null 'paymentDirection' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionType("test-transaction-type", null, null, null, null);
                    }).to.throw("No 'paymentDirection' parameter provided in TransactionFactory::createNewTransactionType().");
                });
            });
            describe("When called with an empty string 'paymentDirection' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionType("test-transaction-type", "", null, null, null);
                    }).to.throw("No 'paymentDirection' parameter provided in TransactionFactory::createNewTransactionType().");
                });
            });
            describe("When called with a 'paymentDirection' parameter that is not 'incoming' or 'outgoing'", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionType("test-transaction-type", "Incoming", null, null, null);
                    }).to.throw("Incorrect 'paymentDirection' parameter provided in TransactionFactory::createNewTransactionType().");
                });
            });
            describe("When called with a null 'classification' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionType("test-transaction-type", "incoming", null, null, null);
                    }).to.throw("No 'classification' parameter provided in TransactionFactory::createNewTransactionType().");
                });
            });
            describe("When called with an empty string 'classification' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionType("test-transaction-type", "incoming", "", null, null);
                    }).to.throw("No 'classification' parameter provided in TransactionFactory::createNewTransactionType().");
                });
            });
            describe("When called with a null 'userId' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionType("test-transaction-type", "incoming", "test-classification", null, null);
                    }).to.throw("No 'userId' parameter provided in TransactionFactory::createNewTransactionType().");
                });
            });
            describe("When called with an empty string 'userId' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionType("test-transaction-type", "incoming", "test-classification", "", null);
                    }).to.throw("No 'userId' parameter provided in TransactionFactory::createNewTransactionType().");
                });
            });
            describe("When called with a null 'isTaxable' parameter", function () {
                chai.expect(function () {
                    var x = TransactionFactory.createNewTransactionType("test-transaction-type", "incoming", "test-classification", "test-user", null);
                }).to.throw("No 'isTaxable' parameter provided in TransactionFactory::createNewTransactionType().");
            });
        });
        describe("When called with valid mandatory parameters", function () {
            describe("When called with no optional parameters", function () {
                it("should return a transactionType object with only required properties", function () {
                    var expectedObject = {
                        name: "test-transaction-type",
                        paymentDirection: "incoming",
                        classification: "utilities",
                        isDefault: false,
                        userId: "test-user",
                        isTaxable: false
                    };
                    var transactionType = TransactionFactory.createNewTransactionType("test-transaction-type", "incoming", "utilities", "test-user", false);
                    chai.expect(transactionType).to.deep.equal(expectedObject);
                });
            });
            describe("When called with a null 'subClassification' parameter", function () {
                it("should return a transactionType object with only required properties", function () {
                    var expectedObject = {
                        name: "test-transaction-type",
                        paymentDirection: "incoming",
                        classification: "utilities",
                        isDefault: false,
                        userId: "test-user",
                        isTaxable: false
                    };
                    var transactionType = TransactionFactory.createNewTransactionType("test-transaction-type", "incoming", "utilities", "test-user", false, null);
                    chai.expect(transactionType).to.deep.equal(expectedObject);
                });
            });
            describe("When called with an empty string 'subClassification' parameter", function () {
                it("should return a transactionType object with only required properties", function () {
                    var expectedObject = {
                        name: "test-transaction-type",
                        paymentDirection: "incoming",
                        classification: "utilities",
                        isDefault: false,
                        userId: "test-user",
                        isTaxable: false
                    };
                    var transactionType = TransactionFactory.createNewTransactionType("test-transaction-type", "incoming", "utilities", "test-user", false, "");
                    chai.expect(transactionType).to.deep.equal(expectedObject);
                });
            });
            describe("When called with a valid 'subClassification' parameter", function () {
                it("should return a transactionType object with a 'subClassification' property", function () {
                    var expectedObject = {
                        name: "test-transaction-type",
                        paymentDirection: "incoming",
                        classification: "utilities",
                        isDefault: false,
                        userId: "test-user",
                        isTaxable: false,
                        subClassification: "gas"
                    };
                    var transactionType = TransactionFactory.createNewTransactionType("test-transaction-type", "incoming", "utilities", "test-user", false, "gas");
                    chai.expect(transactionType).to.deep.equal(expectedObject);
                });
            });
        });
    });
    describe("createNewTransactionInstance", function () {
        describe("When called with invalid parameters", function () {
            describe("When called with a null 'transactionTypeId' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionInstance(null, null, null, null);
                    }).to.throw("No 'transactionTypeId' parameter provided in TransactionFactory::createNewTransactionInstance().");
                });
            });
            describe("When called with an empty string 'transactionTypeId' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionInstance("", null, null, null);
                    }).to.throw("No 'transactionTypeId' parameter provided in TransactionFactory::createNewTransactionInstance().");
                });
            });
            describe("When called with a null 'userId' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionInstance("transaction-type-id-one", null, null, null);
                    }).to.throw("No 'userId' parameter provided in TransactionFactory::createNewTransactionInstance().");
                });
            });
            describe("When called with an empty string 'userId' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionInstance("transaction-type-id-one", "", null, null);
                    }).to.throw("No 'userId' parameter provided in TransactionFactory::createNewTransactionInstance().");
                });
            });
            describe("When called with a null 'date' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionInstance("transaction-type-id-one", "test-user", null, null);
                    }).to.throw("No 'date' parameter provided in TransactionFactory::createNewTransactionInstance().");
                });
            });
            describe("When called with a null 'adjustment' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewTransactionInstance("transaction-type-id-one", "test-user", new Date(), null);
                    }).to.throw("No 'adjustment' parameter provided in TransactionFactory::createNewTransactionInstance().");
                });
            });
        });
        describe("When called with valid parameters", function () {
            it("should return a recurringTransaction object with the first dueDate set", function () {
                var transaction = TransactionFactory.createNewTransactionInstance("transaction-type-id-one", "test-user", new Date(2015, 0, 1), 123);
                chai.expect(transaction.transactionTypeId).to.equal("transaction-type-id-one");
                chai.expect(transaction.transactions).to.have.lengthOf(1);
            });
        });
    });
    describe("createNewRecurringTransactionInstance", function () {
        describe("When called with invalid parameters", function () {
            describe("When called with a null 'transactionTypeId' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewRecurringTransactionInstance(null, null, null, null);
                    }).to.throw("No 'transactionTypeId' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
                });
            });
            describe("When called with an empty string 'transactionTypeId' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewRecurringTransactionInstance("", null, null, null);
                    }).to.throw("No 'transactionTypeId' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
                });
            });
            describe("When called with a null 'userId' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewRecurringTransactionInstance("test-transaction-type-one", null, null, null);
                    }).to.throw("No 'userId' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
                });
            });
            describe("When called with an empty string 'userId' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewRecurringTransactionInstance("test-transaction-type-one", "", null, null);
                    }).to.throw("No 'userId' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
                });
            });
            describe("When called with a null 'date' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewRecurringTransactionInstance("test-transaction-type-one", "test-user", null, null);
                    }).to.throw("No 'date' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
                });
            });
            describe("When called with a null 'adjustment' parameter", function () {
                it("should throw an error", function () {
                    chai.expect(function () {
                        var x = TransactionFactory.createNewRecurringTransactionInstance("test-transaction-type-one", "test-user", new Date(), null);
                    }).to.throw("No 'adjustment' parameter provided in TransactionFactory::createNewRecurringTransactionInstance().");
                });
            });
        });
        describe("When called with valid parameters", function () {
            it("should return a nonRecurringTransaction object", function () {
                var transaction = TransactionFactory.createNewRecurringTransactionInstance("test-transaction-type-one", "test-user", moment().subtract(1, "month").toDate(), 123);
                chai.expect(transaction).to.not.be.undefined;
                chai.expect(transaction.adjustment).to.equal(123);
                chai.expect(transaction.transactionTypeId).to.equal("test-transaction-type-one");
                chai.expect(transaction.userId).to.equal("test-user");
                chai.expect(transaction.transactions).to.have.lengthOf(2);
            });
        });
    });
});
//# sourceMappingURL=TransactionFactorySpec.js.map