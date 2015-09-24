/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class UserController implements IUserController
    {
        private loginService: ILoginService;

        public username = "";
        public password = "";
        public balance;
        public preferredName;
        public lowLimitWarning;

        public static $inject = ['$scope', '$state', 'loginService', 'toasty'];

        constructor(public $scope: IUserControllerScope, public $state: ng.ui.IStateService, loginService: ILoginService, public toasty: toasty.IToastyService)
        {
            $scope.vm = this;
            this.loginService = loginService;
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
                    this.$state.go("home");
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