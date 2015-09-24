///// <reference path="../../typings/tsd.d.ts" />
//
//import chai = require("chai");
//import _ = require("underscore");
//
//import Database = require("../../database/Database");
//import FinancialPlanning = require("financial-planning");
//import TransactionTypeDal = require("../../database/TransactionTypeDal");
//import UuidUtilities = require("../../utilities/UuidUtilities");
//
//var database: FinancialPlanning.Server.Database.IDatabase;
//var transactionTypeDal: TransactionTypeDal;
//
//describe.only("TransactionTypeDal", () =>
//{
//    let idOne = UuidUtilities.createNewMongodbId();
//    let idTwo = UuidUtilities.createNewMongodbId();
//
//    before((done) =>
//    {
//        database = new Database();
//        transactionTypeDal = new TransactionTypeDal(database, "transaction-type-test");
//        done();
//    });
//
//    beforeEach((done) =>
//    {
//        var testData: Array<FinancialPlanning.Common.Transactions.ITransactionType> = [
//            {
//                _id: idOne,
//                name: "test",
//                paymentDirection: "incoming",
//                classification: "Test",
//                isDefault: true,
//                isTaxable: false
//            },
//            {
//                _id: idTwo,
//                paymentDirection: "incoming",
//                name: "test",
//                classification: "Test",
//                user: "test-user",
//                isDefault: false,
//                isTaxable: false
//            }
//        ];
//        return database.writeMultipleObjects("transaction-type-test", testData)
//            .then(() =>
//            {
//                done();
//            });
//    });
//
//    afterEach((done) =>
//    {
//        return database.deleteCollection("transaction-type-test")
//            .then(() =>
//            {
//                done();
//            })
//            .catch((error) =>
//            {
//                console.log(error);
//            });
//    });
//
//    //after(() =>
//    //{
//    //    return database.close();
//    //});
//
//    describe("createTransactionType", () =>
//    {
//        describe("When called with invalid parameters", () =>
//        {
//            describe("When called with a null 'transactionType' parameter", () =>
//            {
//                it("should return a promise that is rejected with an error", () =>
//                {
//                    return transactionTypeDal.createTransactionType(null)
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("No 'transactionType' parameter provided in TransactionTypeDal::createTransactionType().");
//                        });
//                });
//            });
//        });
//
//        describe("When called with valid parameters", () =>
//        {
//            let id = UuidUtilities.createNewMongodbId();
//
//            it("should insert the transaction type into the datastore", () =>
//            {
//                after(() =>
//                {
//                    return database.deleteObject("transaction-type-test", {"_id": id});
//                });
//
//                var transactionType: FinancialPlanning.Common.Transactions.ITransactionType = {
//                    _id: id,
//                    paymentDirection: "outgoing",
//                    name: "mobile phone plan",
//                    classification: "Mobile",
//                    isDefault: false,
//                    isTaxable: false,
//                    userId: "test-user"
//                };
//
//                return transactionTypeDal.createTransactionType(transactionType)
//                    .then((response: FinancialPlanning.Common.Transactions.ITransactionType) =>
//                    {
//                        chai.expect(response).to.not.be.undefined;
//                        chai.expect(response._id).to.not.be.undefined;
//                        chai.expect(response.name).to.equal("mobile phone plan");
//
//                        //sanity check, get the item
//                        return transactionTypeDal.getTransactionType(id.toString(), "test-user")
//                    })
//                    .then((response: FinancialPlanning.Common.Transactions.ITransactionType) =>
//                    {
//                        chai.expect(response).to.not.be.undefined;
//                        chai.expect(response.name).to.equal("mobile phone plan");
//                    })
//                    .catch((error: any) =>
//                    {
//                        chai.expect(error).to.be.undefined;
//                    });
//            });
//        });
//    });
//
//    describe("getTransactionType", () =>
//    {
//        describe("When called with invalid parameters", () =>
//        {
//            describe("When called with a null 'transactionTypeId' parameter", () =>
//            {
//                it("should return a promise that is rejected with an error", () =>
//                {
//                    return transactionTypeDal.getTransactionType(null)
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("No 'transactionTypeId' parameter provided in TransactionTypeDal::getTransactionType().");
//                        });
//                });
//            });
//
//            describe("When called with an empty string 'transactionTypeId' parameter", () =>
//            {
//                it("should return a promise that is rejected with an error", () =>
//                {
//                    return transactionTypeDal.getTransactionType("")
//                        .then((response: any) =>
//                        {
//                            chai.expect(response).to.be.undefined;
//                        })
//                        .catch((error: any) =>
//                        {
//                            chai.expect(error).to.not.be.undefined;
//                            chai.expect(error.message).to.equal("No 'transactionTypeId' parameter provided in TransactionTypeDal::getTransactionType().");
//                        });
//                });
//            });
//        });
//
//        describe("When called with valid parameters", () =>
//        {
//            describe("When called with a transactionTypeId only", () =>
//            {
//                describe("When the transactionTypeId matches one in the datastore", () =>
//                {
//                    describe("When the transaction type has no user property", () =>
//                    {
//                        it("should return the transaction type", () =>
//                        {
//                            return transactionTypeDal.getTransactionType(idOne.toString())
//                                .then((response: FinancialPlanning.Common.Transactions.ITransactionType) =>
//                                {
//                                    chai.expect(response).to.not.be.undefined;
//                                    chai.expect(response.name).to.equal("test");
//                                })
//                                .catch((error: any) =>
//                                {
//                                    chai.expect(error).to.be.undefined;
//                                });
//                        });
//                    });
//
//                    //describe("When the transaction type has a user property", () =>
//                    //{
//                    //    it("should reject the promise with an error", () =>
//                    //    {
//                    //        return transactionTypeDal.getTransactionType(idTwo.toString())
//                    //            .then((response: any) =>
//                    //            {
//                    //                chai.expect(response).to.be.undefined;
//                    //            })
//                    //            .catch((error: any) =>
//                    //            {
//                    //                chai.expect(error).to.not.be.undefined;
//                    //                chai.expect(error.message).to.equal("No transaction type found");
//                    //            });
//                    //    });
//                    //});
//                });
//
//                //describe("When the transactionTypeId does not match one in the datastore", () =>
//                //{
//                //    it("should return an error", () =>
//                //    {
//                //        return transactionTypeDal.getTransactionType("does-not-exist")
//                //            .then((response: any) =>
//                //            {
//                //                chai.expect(response).to.be.undefined;
//                //            })
//                //            .catch((error: any) =>
//                //            {
//                //                chai.expect(error).to.not.be.undefined;
//                //                chai.expect(error.message).to.equal('No item found using match: {"_id":"does-not-exist"}');
//                //            });
//                //    });
//                //});
//            });
//
//            //describe("When called with a transactionTypeId and a userId", () =>
//            //{
//            //    describe("When the transactionTypeId matches one in the datastore", () =>
//            //    {
//            //        describe("When the transaction type has no user property", () =>
//            //        {
//            //            before(() =>
//            //            {
//            //                var transactionType: FinancialPlanning.Common.Transactions.ITransactionType = {
//            //                    _id: "test-transaction-type-three",
//            //                    paymentDirection: "incoming",
//            //                    name: "test",
//            //                    classification: "Test"
//            //                };
//            //
//            //                return database.writeObject("transaction-type-test", transactionType);
//            //            });
//            //
//            //            it("should return the transaction type", () =>
//            //            {
//            //                return transactionTypeDal.getTransactionType("test-transaction-type-three", "test-user")
//            //                    .then((response: FinancialPlanning.Common.Transactions.ITransactionType) =>
//            //                    {
//            //                        chai.expect(response).to.not.be.undefined;
//            //                        chai.expect(response.name).to.equal("test");
//            //                    })
//            //                    .catch((error: any) =>
//            //                    {
//            //                        chai.expect(error).to.be.undefined;
//            //                    });
//            //            });
//            //        });
//            //
//            //        describe("When the transaction type has a user property", () =>
//            //        {
//            //            describe("When it matches the userId provided", () =>
//            //            {
//            //                before(() =>
//            //                {
//            //                    var transactionType: FinancialPlanning.Common.Transactions.ITransactionType = {
//            //                        _id: "test-transaction-type-four",
//            //                        paymentDirection: "incoming",
//            //                        name: "test",
//            //                        classification: "Test",
//            //                        user: "test-user"
//            //                    };
//            //
//            //                    return database.writeObject("transaction-type-test", transactionType);
//            //                });
//            //
//            //                it("should return the transaction", () =>
//            //                {
//            //                    return transactionTypeDal.getTransactionType("test-transaction-type-four", "test-user")
//            //                        .then((response: FinancialPlanning.Common.Transactions.ITransactionType) =>
//            //                        {
//            //                            chai.expect(response).to.not.be.undefined;
//            //                            chai.expect(response.name).to.equal("test");
//            //                        })
//            //                        .catch((error: any) =>
//            //                        {
//            //                            chai.expect(error).to.be.undefined;
//            //                        });
//            //                });
//            //            });
//            //
//            //            describe("When it does not match the userId provided", () =>
//            //            {
//            //                before(() =>
//            //                {
//            //                    var transactionType: FinancialPlanning.Common.Transactions.ITransactionType = {
//            //                        _id: "test-transaction-type-five",
//            //                        paymentDirection: "incoming",
//            //                        name: "test",
//            //                        classification: "Test",
//            //                        user: "test-user-two"
//            //                    };
//            //
//            //                    return database.writeObject("transaction-type-test", transactionType);
//            //                });
//            //
//            //                it("should not return the transaction", () =>
//            //                {
//            //                    return transactionTypeDal.getTransactionType("test-transaction-type-five", "test-user")
//            //                        .then((response: any) =>
//            //                        {
//            //                            chai.expect(response).to.be.undefined;
//            //                        })
//            //                        .catch((error: any) =>
//            //                        {
//            //                            chai.expect(error).to.not.be.undefined;
//            //                            chai.expect(error.message).to.equal("No transaction type found");
//            //                        });
//            //                });
//            //            });
//            //        });
//            //    });
//            //});
//        });
//    });
//
//    //describe("getAllTransactionTypes", () =>
//    //{
//    //    before((done) =>
//    //    {
//    //        var transactionTypes = dataProvider.getTransactionTypes(4);
//    //        var promises: Array<Promise<any>> = [];
//    //
//    //        transactionTypes.forEach((transactionType: FinancialPlanning.Common.Transactions.ITransactionType) =>
//    //        {
//    //            promises.push(database.writeObject("transaction-type-test", transactionType));
//    //        });
//    //
//    //        Promise.all(promises)
//    //            .then(() =>
//    //            {
//    //                done();
//    //            });
//    //    });
//    //
//    //    describe("When called with no 'userId' parameter", () =>
//    //    {
//    //        it("should return all transaction types found in the datastore without a user property", () =>
//    //        {
//    //            return transactionTypeDal.getAllTransactionTypes()
//    //                .then((response: Array<FinancialPlanning.Common.Transactions.ITransactionType>) =>
//    //                {
//    //                    chai.expect(response).to.not.be.undefined;
//    //                    chai.expect(response.length).to.equal(2);
//    //                    chai.expect(_.findWhere(response, {name: "gas bill"})).to.not.be.undefined;
//    //                    chai.expect(_.findWhere(response, {name: "electricity"})).to.not.be.undefined;
//    //                    chai.expect(_.findWhere(response, {name: "salary"})).to.be.undefined;
//    //                    chai.expect(_.findWhere(response, {name: "tax credit"})).to.be.undefined;
//    //                })
//    //                .catch((error: any) =>
//    //                {
//    //                    chai.expect(error).to.be.undefined;
//    //                });
//    //        });
//    //    });
//    //
//    //    describe("When called with a 'userId' parameter", () =>
//    //    {
//    //        it("should return all transaction types without a user property, and all that have a user property that matches the given userId", () =>
//    //        {
//    //            return transactionTypeDal.getAllTransactionTypes("test-user-two")
//    //                .then((response: Array<FinancialPlanning.Common.Transactions.ITransactionType>) =>
//    //                {
//    //                    chai.expect(response).to.not.be.undefined;
//    //                    chai.expect(response.length).to.equal(3);
//    //                    chai.expect(_.findWhere(response, {name: "gas bill"})).to.not.be.undefined;
//    //                    chai.expect(_.findWhere(response, {name: "electricity"})).to.not.be.undefined;
//    //                    chai.expect(_.findWhere(response, {name: "salary"})).to.not.be.undefined;
//    //                    chai.expect(_.findWhere(response, {name: "tax credit"})).to.be.undefined;
//    //                })
//    //                .catch((error: any) =>
//    //                {
//    //                    chai.expect(error).to.be.undefined;
//    //                });
//    //        });
//    //    });
//    //});
//
//    //describe("deleteTransactionType", () =>
//    //{
//    //    describe("When called with invalid parameters", () =>
//    //    {
//    //        describe("When called with a null 'transactionTypeId' parameter", () =>
//    //        {
//    //            it("should return a promise that is rejected with an error", () =>
//    //            {
//    //                return transactionTypeDal.deleteTransactionType(null)
//    //                    .then((response: any) =>
//    //                    {
//    //                        chai.expect(response).to.be.undefined;
//    //                    })
//    //                    .catch((error: any) =>
//    //                    {
//    //                        chai.expect(error).to.not.be.undefined;
//    //                        chai.expect(error.message).to.equal("No 'transactionTypeId' parameter provided in TransactionTypeDal::deleteTransactionType().");
//    //                    });
//    //            });
//    //        });
//    //
//    //        describe("When called with an empty string 'transactionTypeId' parameter", () =>
//    //        {
//    //            it("should return a promise that is rejected with an error", () =>
//    //            {
//    //                return transactionTypeDal.deleteTransactionType("")
//    //                    .then((response: any) =>
//    //                    {
//    //                        chai.expect(response).to.be.undefined;
//    //                    })
//    //                    .catch((error: any) =>
//    //                    {
//    //                        chai.expect(error).to.not.be.undefined;
//    //                        chai.expect(error.message).to.equal("No 'transactionTypeId' parameter provided in TransactionTypeDal::deleteTransactionType().");
//    //                    });
//    //            });
//    //        });
//    //    });
//    //
//    //    describe("When called with valid parameters", () =>
//    //    {
//    //        describe("When the transaction type exists in the datastore", () =>
//    //        {
//    //            before(() =>
//    //            {
//    //                var transactionType: FinancialPlanning.Common.Transactions.ITransactionType = {
//    //                    _id: "test-transaction-type-six",
//    //                    paymentDirection: "outgoing",
//    //                    name: "mobile phone plan",
//    //                    classification: "Mobile"
//    //                };
//    //
//    //                return database.writeObject("transaction-type-test", transactionType);
//    //            });
//    //
//    //            it("should delete that transaction type", () =>
//    //            {
//    //                return transactionTypeDal.deleteTransactionType("test-transaction-type-six")
//    //                    .then((response: string) =>
//    //                    {
//    //                        chai.expect(response).to.not.be.undefined;
//    //                        chai.expect(response).to.equal("Success");
//    //                    })
//    //                    .catch((error: any) =>
//    //                    {
//    //                        chai.expect(error).to.be.undefined;
//    //                    });
//    //            });
//    //        });
//    //
//    //        describe("When the transaction type does not exist in the datastore", () =>
//    //        {
//    //            it("should reject the promise with an error", () =>
//    //            {
//    //                return transactionTypeDal.deleteTransactionType("does-not-exist")
//    //                    .then((response: any) =>
//    //                    {
//    //                        chai.expect(response).to.be.undefined;
//    //                    })
//    //                    .catch((error: any) =>
//    //                    {
//    //                        chai.expect(error).to.not.be.undefined;
//    //                        chai.expect(error.message).to.equal("Could not delete transaction type does-not-exist");
//    //                    });
//    //            });
//    //        });
//    //    });
//    //});
//
//    //describe("updateTransactionType", () =>
//    //{
//    //    describe("When called with invalid parameter", () =>
//    //    {
//    //        describe("When called with a null 'transactionTypeId' parameter", () =>
//    //        {
//    //            it("should return a promise that is rejected with an error", () =>
//    //            {
//    //                return transactionTypeDal.updateTransactionType(null)
//    //                    .then((response: any) =>
//    //                    {
//    //                        chai.expect(response).to.be.undefined;
//    //                    })
//    //                    .catch((error: any) =>
//    //                    {
//    //                        chai.expect(error).to.not.be.undefined;
//    //                        chai.expect(error.message).to.equal("No 'transactionTypeId' parameter provided in TransactionTypeDal::updateTransactionType().");
//    //                    });
//    //            });
//    //        });
//    //
//    //        describe("When called with an empty string 'transactionTypeId' parameter", () =>
//    //        {
//    //            it("should return a promise that is rejected with an error", () =>
//    //            {
//    //                return transactionTypeDal.updateTransactionType("")
//    //                    .then((response: any) =>
//    //                    {
//    //                        chai.expect(response).to.be.undefined;
//    //                    })
//    //                    .catch((error: any) =>
//    //                    {
//    //                        chai.expect(error).to.not.be.undefined;
//    //                        chai.expect(error.message).to.equal("No 'transactionTypeId' parameter provided in TransactionTypeDal::updateTransactionType().");
//    //                    });
//    //            });
//    //        });
//    //
//    //        describe("When called with a 'paymentDirection' parameter that does not equal 'incoming' or 'outgoing'", () =>
//    //        {
//    //            it("should return a promise that is rejected with an error", () =>
//    //            {
//    //                return transactionTypeDal.updateTransactionType("test", "notIncoming")
//    //                    .then((response: any) =>
//    //                    {
//    //                        chai.expect(response).to.be.undefined;
//    //                    })
//    //                    .catch((error: any) =>
//    //                    {
//    //                        chai.expect(error).to.not.be.undefined;
//    //                        chai.expect(error.message).to.equal("'paymentDirection' must be incoming or outgoing");
//    //                    });
//    //            });
//    //        });
//    //    });
//    //
//    //    describe("When called with valid parameters", () =>
//    //    {
//    //        describe("When called with a transactionTypeId that does not match any in the datastore", () =>
//    //        {
//    //            it("should return a promise that is rejected with an error", () =>
//    //            {
//    //                return transactionTypeDal.updateTransactionType("55ef3ad0f9c5aaec047da2c4", "incoming")
//    //                    .then((response: any) =>
//    //                    {
//    //                        chai.expect(response).to.be.undefined;
//    //                    })
//    //                    .catch((error: any) =>
//    //                    {
//    //                        chai.expect(error).to.not.be.undefined;
//    //                        chai.expect(error.message).to.equal('No item found using match: {"_id":"55ef3ad0f9c5aaec047da2c4"}')
//    //                    });
//    //            });
//    //        });
//    //
//    //        describe("When called with a transactionTypeId that does match one in the datastore", () =>
//    //        {
//    //            var id;
//    //
//    //            before((done: MochaDone) =>
//    //            {
//    //                var transactionType: FinancialPlanning.Common.Transactions.ITransactionType = {
//    //                    name: "test-transaction",
//    //                    paymentDirection: "outgoing",
//    //                    classification: "Test"
//    //                };
//    //
//    //                database.writeObject("transaction-type-test", transactionType)
//    //                    .then((response) =>
//    //                    {
//    //                        id = response._id;
//    //                        done();
//    //                    });
//    //            });
//    //
//    //            describe("When called with no additional parameters", () =>
//    //            {
//    //                it("should return a promise that is rejected with an error", () =>
//    //                {
//    //                    return transactionTypeDal.updateTransactionType(id)
//    //                        .then((response: any) =>
//    //                        {
//    //                            chai.expect(response).to.be.undefined;
//    //                        })
//    //                        .catch((error: any) =>
//    //                        {
//    //                            chai.expect(error).to.not.be.undefined;
//    //                            chai.expect(error.message).to.equal("No updates specified in TransactionTypeDal::updateTransactionType().");
//    //                        });
//    //                });
//    //            });
//    //
//    //            describe("When called with a paymentDirection parameter that is 'incoming' or 'outgoing'", () =>
//    //            {
//    //                var id;
//    //
//    //                before((done: MochaDone) =>
//    //                {
//    //                    var transactionType: FinancialPlanning.Common.Transactions.ITransactionType = {
//    //                        name: "test-transaction-twenty",
//    //                        paymentDirection: "outgoing",
//    //                        classification: "Test"
//    //                    };
//    //
//    //                    database.writeObject("transaction-type-test", transactionType)
//    //                        .then((response) =>
//    //                        {
//    //                            id = response._id;
//    //                            done();
//    //                        });
//    //                });
//    //
//    //                it("should return a promise that is resolved with the updated transactionType", () =>
//    //                {
//    //                    return transactionTypeDal.updateTransactionType(id, "incoming")
//    //                        .then((response: FinancialPlanning.Common.Transactions.ITransactionType) =>
//    //                        {
//    //                            chai.expect(response).to.not.be.undefined;
//    //                            chai.expect(response._id).to.deep.equal(id);
//    //                            chai.expect(response.paymentDirection).to.equal("incoming");
//    //                            chai.expect(response.name).to.equal("test-transaction-twenty");
//    //                            chai.expect(response.classification).to.equal("Test");
//    //                        })
//    //                        .catch((error: any) =>
//    //                        {
//    //                            chai.expect(error).to.be.undefined;
//    //                        });
//    //                });
//    //            });
//    //
//    //            describe("When called with a name parameter", () =>
//    //            {
//    //                var id;
//    //
//    //                before((done: MochaDone) =>
//    //                {
//    //                    var transactionType: FinancialPlanning.Common.Transactions.ITransactionType = {
//    //                        name: "test-transaction-twenty",
//    //                        paymentDirection: "outgoing",
//    //                        classification: "Test"
//    //                    };
//    //
//    //                    database.writeObject("transaction-type-test", transactionType)
//    //                        .then((response) =>
//    //                        {
//    //                            id = response._id;
//    //                            done();
//    //                        });
//    //                });
//    //
//    //                it("should return a promise that is resolved with the updated transactionType", () =>
//    //                {
//    //                    return transactionTypeDal.updateTransactionType(id, null, "updated-test-transaction")
//    //                        .then((response: FinancialPlanning.Common.Transactions.ITransactionType) =>
//    //                        {
//    //                            chai.expect(response).to.not.be.undefined;
//    //                            chai.expect(response._id).to.deep.equal(id);
//    //                            chai.expect(response.paymentDirection).to.equal("outgoing");
//    //                            chai.expect(response.name).to.equal("updated-test-transaction");
//    //                            chai.expect(response.classification).to.equal("Test");
//    //                        })
//    //                        .catch((error: any) =>
//    //                        {
//    //                            chai.expect(error).to.be.undefined;
//    //                        });
//    //                });
//    //            });
//    //
//    //            describe("When called with a classification parameter", () =>
//    //            {
//    //                var id;
//    //
//    //                before((done: MochaDone) =>
//    //                {
//    //                    var transactionType: FinancialPlanning.Common.Transactions.ITransactionType = {
//    //                        name: "test-transaction-thirty",
//    //                        paymentDirection: "outgoing",
//    //                        classification: "Test"
//    //                    };
//    //
//    //                    database.writeObject("transaction-type-test", transactionType)
//    //                        .then((response) =>
//    //                        {
//    //                            id = response._id;
//    //                            done();
//    //                        });
//    //                });
//    //
//    //                it("should return a promise that is resolved with the updated transactionType", () =>
//    //                {
//    //                    return transactionTypeDal.updateTransactionType(id, null, null, "UpdatedTest")
//    //                        .then((response: FinancialPlanning.Common.Transactions.ITransactionType) =>
//    //                        {
//    //                            chai.expect(response).to.not.be.undefined;
//    //                            chai.expect(response._id).to.deep.equal(id);
//    //                            chai.expect(response.paymentDirection).to.equal("outgoing");
//    //                            chai.expect(response.name).to.equal("test-transaction-thirty");
//    //                            chai.expect(response.classification).to.equal("UpdatedTest");
//    //                        })
//    //                        .catch((error: any) =>
//    //                        {
//    //                            chai.expect(error).to.be.undefined;
//    //                        });
//    //                });
//    //            });
//    //
//    //            describe("When called with a subClassification parameter", () =>
//    //            {
//    //                var id;
//    //
//    //                before((done: MochaDone) =>
//    //                {
//    //                    var transactionType: FinancialPlanning.Common.Transactions.ITransactionType = {
//    //                        name: "test-transaction-forty",
//    //                        paymentDirection: "outgoing",
//    //                        classification: "Test"
//    //                    };
//    //
//    //                    database.writeObject("transaction-type-test", transactionType)
//    //                        .then((response) =>
//    //                        {
//    //                            id = response._id;
//    //                            done();
//    //                        });
//    //                });
//    //
//    //                it("should return a promise that is resolved with the updated transactionType", () =>
//    //                {
//    //                    return transactionTypeDal.updateTransactionType(id, null, null, null, "updatedSubTest")
//    //                        .then((response: FinancialPlanning.Common.Transactions.ITransactionType) =>
//    //                        {
//    //                            chai.expect(response).to.not.be.undefined;
//    //                            chai.expect(response._id).to.deep.equal(id);
//    //                            chai.expect(response.paymentDirection).to.equal("outgoing");
//    //                            chai.expect(response.name).to.equal("test-transaction-forty");
//    //                            chai.expect(response.classification).to.equal("Test");
//    //                            chai.expect(response.subClassification).to.equal("updatedSubTest");
//    //                        })
//    //                        .catch((error: any) =>
//    //                        {
//    //                            chai.expect(error).to.be.undefined;
//    //                        });
//    //                });
//    //            });
//    //        });
//    //    });
//    //});
//});