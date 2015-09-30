/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class UserController implements IUserController
    {

        public username = "";
        public password = "";
        public balance;
        public preferredName;
        public lowLimitWarning;

        public static $inject = ['$scope', '$state', 'loginService', 'toasty'];

        constructor(public $scope: IUserControllerScope, public $state: ng.ui.IStateService, private loginService: ILoginService, public toasty: toasty.IToastyService)
        {
            $scope.vm = this;
        }

        public createUser(): void
        {
            this.loginService.createUser(this.username, this.password, this.balance, this.preferredName, this.lowLimitWarning)
                .then(() =>
                {
                    this.toasty.success({
                        title: "Success",
                        msg: "Successfully created user " + this.username
                    });
                    this.$state.go("home.charts");
                })
                .catch((error: any) =>
                {
                    var options: toasty.IToastyConfig = {
                        title: "Error Creating User",
                        msg: error.data
                    };
                    this.toasty.error(options);
                });
        }
    }
}