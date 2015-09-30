/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    /**
     * Describes the properties of the transaction type controller
     */
    export interface ITransactionTypeController
    {
        /**
         * The injected transaction types
         */
        transactionTypes: Array<FinancialPlanning.Common.Transactions.ITransactionType>;
        /**
         * The currently selected transaction
         */
        selectedTransaction: FinancialPlanning.Common.Transactions.ITransactionType;
        /**
         * The transaction type form controller
         */
        transactionTypeEdit: ng.IFormController;
        /**
         * Whether or not the user is adding a new transaction type
         */
        isNewTransactionType: boolean;
    }
}