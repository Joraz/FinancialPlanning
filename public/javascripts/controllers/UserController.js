/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var UserController = (function () {
        function UserController($scope, $state, loginService, toasty) {
            this.$scope = $scope;
            this.$state = $state;
            this.loginService = loginService;
            this.toasty = toasty;
            this.username = "";
            this.password = "";
            $scope.vm = this;
        }
        UserController.prototype.createUser = function () {
            var _this = this;
            this.loginService.createUser(this.username, this.password, this.balance, this.preferredName, this.lowLimitWarning)
                .then(function () {
                _this.toasty.success({
                    title: "Success",
                    msg: "Successfully created user " + _this.username
                });
                _this.$state.go("home.charts");
            })
                .catch(function (error) {
                var options = {
                    title: "Error Creating User",
                    msg: error.data
                };
                _this.toasty.error(options);
            });
        };
        UserController.$inject = ['$scope', '$state', 'loginService', 'toasty'];
        return UserController;
    })();
    FinancialPlanning.UserController = UserController;
})(FinancialPlanning || (FinancialPlanning = {}));
//# sourceMappingURL=UserController.js.map