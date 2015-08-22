/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    export interface ILoginControllerScope extends ng.IScope
    {
        username: string;

        password: string;
    }
}