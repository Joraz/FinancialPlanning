/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    /**
     * Describes the transaction controller $scope
     */
    export interface ITransactionControllerScope extends ng.IScope
    {
        vm: ITransactionController;
        transactionEdit: ng.IFormController;
    }
}