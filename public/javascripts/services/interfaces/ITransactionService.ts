/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    export interface ITransactionService
    {
        getTransactionInstances(startDate?: Date, endDate?: Date): ng.IPromise<Array<FinancialPlanning.Common.Transactions.ITransactionInstance>>;
        getRecurringTransactionInstances(startDate?: Date, endDate?: Date): ng.IPromise<Array<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>>;
        getIncomingTotals(): ng.IPromise<Array<FinancialPlanning.Common.Transactions.IMonthTotal>>;
        getOutgoingTotals(): ng.IPromise<Array<FinancialPlanning.Common.Transactions.IMonthTotal>>;
        getTransactionSummaries(startDate?: Date, endDate?: Date): ng.IPromise<Array<FinancialPlanning.Common.Transactions.ITransactionSummary>>;
        createNewTransactionInstance(transactionTypeId: string, date: Date, adjustment: number): ng.IPromise<FinancialPlanning.Common.Transactions.ITransactionInstance>;
        createNewRecurringTransactionInstance(transactionTypeId: string, startDate: Date, adjustment: number): ng.IPromise<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>;
        cancelRecurringTransaction(transactionInstanceId: string): ng.IPromise<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>;
        getTransactionTypes(): ng.IPromise<Array<FinancialPlanning.Common.Transactions.ITransactionType>>;
        createNewTransactionType(name: string, paymentDirection: string, classification: string, isTaxable: boolean, subClassification?: string): ng.IPromise<FinancialPlanning.Common.Transactions.ITransactionType>;
        updateTransactionType(transactionTypeId: string, name?: string, classification?: string, subClassification?: string): ng.IPromise<FinancialPlanning.Common.Transactions.ITransactionType>;
    }
}