/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class LoginController implements ILoginController
    {
        public static $inject = ['$scope', '$state', 'loginService', 'toasty'];

        public username = "";
        public password = "";

        constructor(public $scope: ILoginControllerScope, public $state: ng.ui.IStateService,
                    public loginService: ILoginService, public toasty: toasty.IToastyService)
        {
            $scope.vm = this;
        }

        public login(): void
        {
            this.loginService.login(this.username, this.password)
                .then(() =>
                {
                    this.toasty.success({
                        title: "Success",
                        msg: "Successfully logged in"
                    });
                    this.$state.go("home.charts");
                })
                .catch((error: any) =>
                {
                    this.toasty.error({
                        title: "Error Logging In",
                        msg: error.data
                    });
                });
        }

        public createNewUser(): void
        {
            this.$state.go("createUser");
        }
    }
}