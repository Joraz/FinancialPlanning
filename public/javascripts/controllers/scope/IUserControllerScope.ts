/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    /**
     * Describes the user controller scope
     */
    export interface IUserControllerScope extends ng.IScope
    {
        vm: IUserController;
    }
}