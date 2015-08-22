/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    export interface ILoginService
    {
        login: (username: string, password: string) => ng.IPromise<any>;
    }
}