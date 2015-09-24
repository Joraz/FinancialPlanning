/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    export interface IHomeController
    {
        name: string;
        balance: number;
        isActive(path: string): boolean;
    }
}