/// <reference path="../../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var UserEditController = (function () {
        function UserEditController($scope, $modal, userData, loginService, toasty) {
            this.$scope = $scope;
            this.$modal = $modal;
            this.loginService = loginService;
            this.toasty = toasty;
            $scope.vm = this;
            this.preferredName = userData.preferredName;
            this.lowLimitWarning = userData.lowLimitWarning;
            this.password = "";
        }
        UserEditController.prototype.saveUserDetails = function () {
            var _this = this;
            var password = this.password === "" ? null : this.password;
            this.loginService.updateUser(this.preferredName, this.lowLimitWarning, password)
                .then(function (response) {
                _this.$scope.$emit('balanceUpdateRequired');
                _this.toasty.success({
                    title: "Success!",
                    msg: "User details saved"
                });
            })
                .catch(function (error) {
                _this.toasty.error({
                    title: "Error saving user details",
                    msg: error.data
                });
            });
        };
        UserEditController.prototype.deleteUser = function () {
            this.$modal.open({
                animation: true,
                templateUrl: "templates/confirm-modal.html",
                controller: "modalController"
            });
        };
        UserEditController.$inject = ['$scope', '$modal', 'userData', 'loginService', 'toasty'];
        return UserEditController;
    })();
    FinancialPlanning.UserEditController = UserEditController;
})(FinancialPlanning || (FinancialPlanning = {}));
//# sourceMappingURL=UserEditController.js.map