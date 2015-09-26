/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    export interface ITransactionControllerScope extends ng.IScope
    {
        vm: ITransactionController;
        transactionEdit: ng.IFormController;
    }
}