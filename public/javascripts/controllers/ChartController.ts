/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class ChartController implements IChartController
    {
        //public balanceSummary: Array<FinancialPlanning.Common.Users.IBalanceSummary>;
        public transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>;
        public donutChartSettings;
        public donutChartData = {};
        public transactionsFrom: Date;
        public transactionsTo: Date;
        public dates: Array<string>;
        public balances: Array<Array<number>>;

        public static $inject = ['$scope', 'transactionSummaries'];

        constructor(public $scope: IChartControllerScope, transactionSummaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>)
        {
            $scope.vm = this;
            this.dates = [];
            this.balances = [];
            this.transactionSummaries = transactionSummaries;
            this.setChartData(transactionSummaries);
            this.donutChartSettings = {
                tooltipTemplate: (label: PointsAtEvent) =>
                {
                    return label.label + ": " + Math.abs(label.value).toFixed(2);
                }
            };
            //this.balanceSummary = balanceSummary;
        }

        public setChartData(summaries: Array<FinancialPlanning.Common.Transactions.ITransactionSummary>): void
        {
            //var balances = [];
            //
            //summaries.forEach((summary: FinancialPlanning.Common.Users.IBalanceSummary) =>
            //{
            //    this.dates.push(summary.date);
            //    balances.push(summary.balance);
            //});
            //
            //this.dates.reverse();
            //balances.reverse();
            //this.balances = [balances];

            // Group by classification

            var classifications = {};

            summaries.forEach((summary: FinancialPlanning.Common.Transactions.ITransactionSummary) =>
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

            // Group by subclassification

            var subClassifications = {};

            summaries.forEach((summary: FinancialPlanning.Common.Transactions.ITransactionSummary) =>
            {
                if (!subClassifications[summary.subClassification])
                {
                    subClassifications[summary.subClassification] = {
                        adjustment: summary.adjustment
                    };
                }
                else
                {
                    subClassifications[summary.subClassification].adjustment += summary.adjustment;
                }
            });

            this.donutChartData["subClassificationNames"] = [];
            this.donutChartData["subClassificationAdjustments"] = [];

            for (var key in subClassifications)
            {
                if (subClassifications.hasOwnProperty(key))
                {
                    this.donutChartData["subClassificationNames"].push(key);
                    this.donutChartData["subClassificationAdjustments"].push(subClassifications[key].adjustment);
                }
            }

            // Group by name

            var names = {};

            summaries.forEach((summary: FinancialPlanning.Common.Transactions.ITransactionSummary) =>
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
    }
}