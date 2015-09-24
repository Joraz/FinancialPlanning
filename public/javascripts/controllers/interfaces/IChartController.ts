/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    export interface IChartController
    {
        //balanceSummary: Array<FinancialPlanning.Common.Users.IBalanceSummary>
        transactionsFrom: Date;
        transactionsTo: Date;
        dates: Array<string>;
        balances: Array<Array<number>>;
    }
}