/// <reference path="../../../../reference.ts" />

module FinancialPlanning
{
    /**
     * Describes the properties of the chart controller
     */
    export interface IChartController
    {
        /**
         * Chart settings for the donut charts
         */
        donutChartSettings: any;
        /**
         * Chart settings for the line charts
         */
        lineChartSettings: any;
        /**
         * Donut chart data
         */
        donutChartData: any;
        /**
         * Date transactions should be shown from
         */
        transactionsFrom: Date;
        /**
         * Date transactions should be shown to
         */
        transactionsTo: Date;
        /**
         * An array of date strings
         */
        dates: Array<string>;
        /**
         * An array of arrays of balances
         */
        balances: Array<Array<number>>;
        /**
         * Dates for the balance forecast
         */
        forecastDates: Array<string>;
        /**
         * Balances for the balance forecast
         */
        forecastBalances: Array<Array<number>>;
        /**
         * Dates for the incoming/outgoing chart
         */
        inOutDates: Array<string>;
        /**
         * Totals for the incoming/outgoing chart
         */
        inOutTotals: Array<Array<number>>;
        /**
         * Series data for the incoming/outgoing chart
         */
        inOutSeries: Array<any>;
        /**
         * Whether the from datepicker is opened/closed
         */
        fromDatepickerStatus: any;
        /**
         * Whether the to datepicker is opened/closed
         */
        toDatepickerStatus: any;
        /**
         * Whether to show the validation error
         */
        showValidationError: boolean;
    }
}