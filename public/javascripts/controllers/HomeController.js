/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var HomeController = (function () {
        function HomeController($scope, $location, loginService, toasty) {
            var _this = this;
            this.$scope = $scope;
            this.$location = $location;
            this.loginService = loginService;
            this.toasty = toasty;
            $scope.vm = this;
            this.getUserSummary();
            $scope.$on('balanceUpdateRequired', function () {
                _this.getUserSummary();
            });
        }
        HomeController.prototype.getUserSummary = function () {
            var _this = this;
            this.loginService.getUserSummary()
                .then(function (summary) {
                _this.name = summary.name;
                _this.balance = summary.balance;
                if (summary.limitWarning) {
                    if (summary.balance < summary.limitWarning) {
                        _this.toasty.warning({
                            title: "Warning",
                            msg: "Your balance has dropped below your configured warning limit"
                        });
                    }
                }
            });
        };
        HomeController.prototype.isActive = function (path) {
            return this.$location.path() === '/home' + path;
        };
        HomeController.$inject = ['$scope', '$location', 'loginService', 'toasty'];
        return HomeController;
    })();
    FinancialPlanning.HomeController = HomeController;
})(FinancialPlanning || (FinancialPlanning = {}));
//# sourceMappingURL=HomeController.js.map