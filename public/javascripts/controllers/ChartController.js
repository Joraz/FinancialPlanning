/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var ChartController = (function () {
        function ChartController($scope, $q, transactionSummaries, balanceSummaries, balanceForecast, incomingTotals, outgoingTotals, transactionService, loginService, toasty) {
            var _this = this;
            this.$scope = $scope;
            this.$q = $q;
            this.transactionService = transactionService;
            this.loginService = loginService;
            this.toasty = toasty;
            this.donutChartData = {};
            this.inOutSeries = [];
            this.showValidationError = false;
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
                tooltipTemplate: function (label) {
                    return label.label + ": " + Math.abs(label.value).toFixed(2);
                }
            };
            this.lineChartSettings = {
                tooltipTemplate: function (label) {
                    return label.label + ": " + label.value.toFixed(2);
                }
            };
            this.fromDatepickerStatus = {
                opened: false
            };
            this.toDatepickerStatus = {
                opened: false
            };
            $scope.$watch('vm.transactionsFrom', function () {
                _this.refreshCharts();
            });
            $scope.$watch('vm.transactionsTo', function () {
                _this.refreshCharts();
            });
        }
        ChartController.prototype.setChartData = function (transactionSummaries, balanceSummaries, balanceForecast, incomingTotals, outgoingTotals) {
            this.setDonutChartData(transactionSummaries);
            this.setLineChartData(balanceSummaries, balanceForecast);
            this.setBarChartData(incomingTotals, outgoingTotals);
        };
        ChartController.prototype.setDonutChartData = function (transactionSummaries) {
            // Group by classification
            var classifications = {};
            transactionSummaries.forEach(function (summary) {
                if (!classifications[summary.classification]) {
                    classifications[summary.classification] = {
                        adjustment: summary.adjustment
                    };
                }
                else {
                    classifications[summary.classification].adjustment += summary.adjustment;
                }
            });
            this.donutChartData["classificationNames"] = [];
            this.donutChartData["classificationAdjustments"] = [];
            for (var key in classifications) {
                if (classifications.hasOwnProperty(key)) {
                    this.donutChartData["classificationNames"].push(key);
                    this.donutChartData["classificationAdjustments"].push(classifications[key].adjustment);
                }
            }
            // Group by name
            var names = {};
            transactionSummaries.forEach(function (summary) {
                if (!names[summary.name]) {
                    names[summary.name] = {
                        adjustment: summary.adjustment
                    };
                }
                else {
                    names[summary.name].adjustment += summary.adjustment;
                }
            });
            this.donutChartData["nameNames"] = [];
            this.donutChartData["nameAdjustments"] = [];
            for (var key in names) {
                if (names.hasOwnProperty(key)) {
                    this.donutChartData["nameNames"].push(key);
                    this.donutChartData["nameAdjustments"].push(names[key].adjustment);
                }
            }
        };
        ChartController.prototype.setLineChartData = function (balanceSummaries, balanceForecast) {
            var _this = this;
            this.dates = [];
            this.balances = [];
            var balances = [];
            balanceSummaries.forEach(function (summary) {
                _this.dates.push(moment(summary.date).format("YYYY-MM-DD"));
                balances.push(summary.balance);
            });
            this.balances = [balances];
            if (balanceForecast) {
                this.forecastDates = [];
                this.forecastBalances = [];
                var forecastBalances = [];
                balanceForecast.forEach(function (summary) {
                    _this.forecastDates.push(moment(summary.date).format("YYYY-MM-DD"));
                    forecastBalances.push(summary.balance);
                });
                this.forecastBalances = [forecastBalances];
            }
        };
        ChartController.prototype.setBarChartData = function (incomingTotals, outgoingTotals) {
            var iTotals = incomingTotals.map(function (x) { return x.total; });
            var oTotals = outgoingTotals.map(function (x) { return x.total; });
            this.inOutDates = incomingTotals.map(function (x) { return x.month; });
            this.inOutTotals = [iTotals, oTotals];
            this.inOutSeries = ["incoming", "outgoing"];
        };
        ChartController.prototype.refreshCharts = function () {
            var _this = this;
            var startMoment = moment(this.transactionsFrom);
            var endMoment = moment(this.transactionsTo);
            if (endMoment.isBefore(startMoment)) {
                this.showValidationError = true;
            }
            else {
                this.showValidationError = false;
                var promises = [];
                promises.push(this.transactionService.getTransactionSummaries(this.transactionsFrom, this.transactionsTo));
                this.$q.all(promises)
                    .then(function (responses) {
                    var transactionSummary = responses[0];
                    _this.setDonutChartData(transactionSummary);
                })
                    .catch(function (error) {
                    _this.toasty.error("Error getting data");
                });
            }
        };
        ChartController.$inject = ['$scope', '$q', 'transactionSummaries', 'balanceSummaries', 'balanceForecast',
            'incomingTotals', 'outgoingTotals', 'transactionService', 'loginService', 'toasty'];
        return ChartController;
    })();
    FinancialPlanning.ChartController = ChartController;
})(FinancialPlanning || (FinancialPlanning = {}));
//# sourceMappingURL=ChartController.js.map