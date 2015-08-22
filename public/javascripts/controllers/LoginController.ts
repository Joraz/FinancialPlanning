/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class LoginController
    {
        private loginService: ILoginService;
        private scope: ILoginControllerScope;

        public static $inject = ['$scope', 'loginService'];

        constructor($scope: ILoginControllerScope, loginService: ILoginService)
        {
            this.scope = $scope;
            this.loginService = loginService;
        }

        public login()
        {
            console.log(this.scope.username);
            console.log(this.scope.password);

            this.loginService.login(this.scope.username, this.scope.password)
                .then((response: any) =>
                {
                    console.log(response);
                })
                .catch((error: any) =>
                {
                    console.log(error);
                });
        }
    }
}