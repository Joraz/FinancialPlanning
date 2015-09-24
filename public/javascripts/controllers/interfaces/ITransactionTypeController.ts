/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    export interface ITransactionTypeController
    {
        transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>;
        selectedTransaction: FinancialPlanning.Common.Transactions.ITransactionType;
        isNewTransactionType: boolean;
        addNewTransactionType(): void;
        selectTransactionType(id: string): void;
        saveTransactionType(): void;
        isActive(id: string): boolean;
    }
}