/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var LoginController = (function () {
        function LoginController($scope, $state, loginService, toasty) {
            this.$scope = $scope;
            this.$state = $state;
            this.loginService = loginService;
            this.toasty = toasty;
            this.username = "";
            this.password = "";
            $scope.vm = this;
        }
        LoginController.prototype.login = function () {
            var _this = this;
            this.loginService.login(this.username, this.password)
                .then(function () {
                _this.toasty.success({
                    title: "Success",
                    msg: "Successfully logged in"
                });
                _this.$state.go("home.charts");
            })
                .catch(function (error) {
                _this.toasty.error({
                    title: "Error Logging In",
                    msg: error.data
                });
            });
        };
        LoginController.prototype.createNewUser = function () {
            this.$state.go("createUser");
        };
        LoginController.$inject = ['$scope', '$state', 'loginService', 'toasty'];
        return LoginController;
    })();
    FinancialPlanning.LoginController = LoginController;
})(FinancialPlanning || (FinancialPlanning = {}));
//# sourceMappingURL=LoginController.js.map