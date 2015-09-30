/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    /**
     * Describes the properties of the transaction controller
     */
    export interface ITransactionController
    {
        /**
         * The currently selected transaction type
         */
        selectedTransactionType: FinancialPlanning.Common.Transactions.ITransactionType;
        /**
         * The currently selection transaction
         */
        selectedTransaction: FinancialPlanning.Common.Transactions.IRecurringTransactionInstance;
        /**
         * The injected transaction types
         */
        transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>;
        /**
         * The injected recurring transactions
         */
        recurringTransactions: Array<FinancialPlanning.Common.Transactions.IRecurringTransactionInstance>;
        /**
         * The injected non-recurring transactions
         */
        nonRecurringTransactions: Array<FinancialPlanning.Common.Transactions.ITransactionInstance>;
        /**
         * Whether or not the user is currently adding a new transaction
         */
        addingNewTransaction: boolean;
        /**
         * Whether or not the user is currently viewing the recurring transactions
         */
        viewingRecurringTransactions: boolean;
        /**
         * Whether or not the new transaction is recurring
         */
        newTransactionIsRecurring: boolean;
        /**
         * The new transaction adjustment
         */
        newTransactionAdjustment: number;
        /**
         * The new transaction date
         */
        newTransactionDate: Date;
        /**
         * The injected transaction summaries
         */
        transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>;
        /**
         * The transaction form controller
         */
        transactionEdit: ng.IFormController;
    }
}