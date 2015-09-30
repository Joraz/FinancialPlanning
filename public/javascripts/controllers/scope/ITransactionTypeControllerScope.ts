/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    /**
     * Describes the transaction type controller $scope
     */
    export interface ITransactionTypeControllerScope extends ng.IScope
    {
        vm: ITransactionTypeController;
        transactionTypeEdit: ng.IFormController;
    }
}