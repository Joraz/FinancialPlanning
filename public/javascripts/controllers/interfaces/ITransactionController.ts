/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    export interface ITransactionController
    {
        //transactionData: Array<FinancialPlanning.Common.Transactions.ITransaction>;
        selectedTransactionType: FinancialPlanning.Common.Transactions.ITransactionType;
        transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>;
        recurringTransactions: Array<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>;
        nonRecurringTransactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>;
        addingNewTransaction: boolean;
        addNewTransaction(): void;
        saveNewTransaction(): void;
    }
}