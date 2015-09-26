/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class ChartController implements IChartController
    {
        public donutChartSettings;
        public lineChartSettings;
        public donutChartData = {};
        public transactionsFrom: Date;
        public transactionsTo: Date;
        public dates: Array<string>;
        public balances: Array<Array<number>>;
        public forecastDates: Array<string>;
        public forecastBalances: Array<Array<number>>;
        public inOutDates: Array<string>;
        public inOutTotals: Array<Array<number>>;
        public inOutSeries = [];
        public fromDatepickerStatus: any;
        public toDatepickerStatus: any;
        public showValidationError = false;

        public static $inject = ['$scope', '$q', 'transactionSummaries', 'balanceSummaries', 'balanceForecast',
            'incomingTotals', 'outgoingTotals', 'transactionService', 'loginService', 'toasty'];

        constructor(public $scope: IChartControllerScope, public $q: ng.IQService,
                    transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>,
                    balanceSummaries: Array<FinancialPlanning.Common.Users.IBalanceSummary>,
                    balanceForecast: Array<FinancialPlanning.Common.Users.IBalanceSummary>,
                    incomingTotals: Array<FinancialPlanning.Common.Transactions.IMonthTotal>,
                    outgoingTotals: Array<FinancialPlanning.Common.Transactions.IMonthTotal>,
                    public transactionService: ITransactionService, public loginService: ILoginService,
                    public toasty: toasty.IToastyService)
        {
            $scope.vm = this;
            this.dates = [];
            this.balances = [];
            this.forecastDates = [];
            this.forecastBalances = [];
            this.inOutTotals = [];
            this.transactionsFrom = moment().subtract(30, "days").toDate();
            this.transactionsTo = moment().toDate();
            this.setChartData(transactionSummaries, balanceSummaries, balanceForecast, incomingTotals, outgoingTotals);
            this.donutChartSettings = {
                tooltipTemplate: (label: PointsAtEvent) =>
                {
                    return label.label + ": " + Math.abs(label.value).toFixed(2);
                }
            };

            this.lineChartSettings = {
                tooltipTemplate: (label: PointsAtEvent) =>
                {
                    return label.label + ": " + label.value.toFixed(2);
                }
            };

            this.fromDatepickerStatus = {
                opened: false
            };
            this.toDatepickerStatus = {
                opened: false
            };

            $scope.$watch('vm.transactionsFrom', () =>
            {
                this.refreshCharts();
            });

            $scope.$watch('vm.transactionsTo', () =>
            {
                this.refreshCharts();
            });
        }

        private setChartData(transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>,
                             balanceSummaries: Array<FinancialPlanning.Common.Users.IBalanceSummary>,
                             balanceForecast: Array<FinancialPlanning.Common.Users.IBalanceSummary>,
                             incomingTotals: Array<FinancialPlanning.Common.Transactions.IMonthTotal>,
                             outgoingTotals: Array<FinancialPlanning.Common.Transactions.IMonthTotal>): void
        {
            this.setDonutChartData(transactionSummaries);
            this.setLineChartData(balanceSummaries, balanceForecast);
            this.setBarChartData(incomingTotals, outgoingTotals);
        }

        private setDonutChartData(transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>): void
        {

            // Group by classification
            var classifications = {};

            transactionSummaries.forEach((summary: FinancialPlanning.Common.Transactions.ITransactionSummary) =>
            {
                if (!classifications[summary.classification])
                {
                    classifications[summary.classification] = {
                        adjustment: summary.adjustment
                    };
                }
                else
                {
                    classifications[summary.classification].adjustment += summary.adjustment;
                }
            });

            this.donutChartData["classificationNames"] = [];
            this.donutChartData["classificationAdjustments"] = [];

            for (var key in classifications)
            {
                if (classifications.hasOwnProperty(key))
                {
                    this.donutChartData["classificationNames"].push(key);
                    this.donutChartData["classificationAdjustments"].push(classifications[key].adjustment);
                }
            }

            // Group by name
            var names = {};

            transactionSummaries.forEach((summary: FinancialPlanning.Common.Transactions.ITransactionSummary) =>
            {
                if (!names[summary.name])
                {
                    names[summary.name] = {
                        adjustment: summary.adjustment
                    };
                }
                else
                {
                    names[summary.name].adjustment += summary.adjustment;
                }
            });

            this.donutChartData["nameNames"] = [];
            this.donutChartData["nameAdjustments"] = [];

            for (var key in names)
            {
                if (names.hasOwnProperty(key))
                {
                    this.donutChartData["nameNames"].push(key);
                    this.donutChartData["nameAdjustments"].push(names[key].adjustment);
                }
            }
        }

        private setLineChartData(balanceSummaries: Array<FinancialPlanning.Common.Users.IBalanceSummary>,
                                 balanceForecast?: Array<FinancialPlanning.Common.Users.IBalanceSummary>): void
        {
            this.dates = [];
            this.balances = [];
            var balances = [];

            balanceSummaries.forEach((summary: FinancialPlanning.Common.Users.IBalanceSummary) =>
            {
                this.dates.push(moment(summary.date).format("YYYY-MM-DD"));
                balances.push(summary.balance);
            });

            this.balances = [balances];

            if (balanceForecast)
            {
                this.forecastDates = [];
                this.forecastBalances = [];
                var forecastBalances = [];

                balanceForecast.forEach((summary: FinancialPlanning.Common.Users.IBalanceSummary) =>
                {
                    this.forecastDates.push(moment(summary.date).format("YYYY-MM-DD"));
                    forecastBalances.push(summary.balance);
                });

                this.forecastBalances = [forecastBalances];
            }
        }

        private setBarChartData(incomingTotals: Array<FinancialPlanning.Common.Transactions.IMonthTotal>,
                                outgoingTotals: Array<FinancialPlanning.Common.Transactions.IMonthTotal>): void
        {
            var iTotals = incomingTotals.map(x => x.total);
            var oTotals = outgoingTotals.map(x => x.total);
            this.inOutDates = incomingTotals.map(x => x.month);
            this.inOutTotals = [iTotals, oTotals];
            this.inOutSeries = ["incoming", "outgoing"];
        }

        private refreshCharts(): void
        {
            var startMoment = moment(this.transactionsFrom);
            var endMoment = moment(this.transactionsTo);

            if (endMoment.isBefore(startMoment))
            {
                this.showValidationError = true;
            }
            else
            {
                this.showValidationError = false;
                var promises: Array<ng.IPromise<any>> = [];
                promises.push(this.transactionService.getTransactionSummaries(this.transactionsFrom, this.transactionsTo));
                this.$q.all(promises)
                    .then((responses: Array<any>) =>
                    {
                        var transactionSummary = <Array<FinancialPlanning.Common.Transactions.ITransactionSummary>>responses[0];
                        this.setDonutChartData(transactionSummary);
                    })
                    .catch((error: any) =>
                    {
                        this.toasty.error("Error getting data");
                    });

            }
        }
    }
}