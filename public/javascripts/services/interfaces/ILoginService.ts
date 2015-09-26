/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    export interface ILoginService
    {
        login(username: string, password: string):ng.IPromise<any>;
        getJWT(): string;
        checkLoginStatus(): ng.IPromise<boolean>;
        getUserSummary(): ng.IPromise<FinancialPlanning.Common.Users.IUserSummary>;
        createUser(username: string, password: string, balance?: number, preferredName?: string, lowLimitWarning?: number): ng.IPromise<any>;
        updateUser(preferredName?: string, lowLimitWarning?: number, password?: string): ng.IPromise<any>;
        getUserDetails(): ng.IPromise<any>;
        getBalanceSummary(startDate: Date, endDate: Date): ng.IPromise<Array<FinancialPlanning.Common.Users.IBalanceSummary>>;
        getBalanceForecast(): ng.IPromise<Array<FinancialPlanning.Common.Users.IBalanceSummary>>;
        deleteUser(): ng.IPromise<any>;
    }
}