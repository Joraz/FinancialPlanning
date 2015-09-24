/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class HomeController implements IHomeController
    {
        public name: string;
        public balance: number;

        public static $inject = ['$scope', '$location', 'loginService'];

        constructor(public $scope: IHomeControllerScope, public $location: ng.ILocationService,
                    private loginService: ILoginService)
        {
            $scope.vm = this;
            this.getUserSummary();

            $scope.$on('balanceUpdateRequired', () =>
            {
                this.getUserSummary();
            });
        }

        public getUserSummary(): void
        {
            this.loginService.getUserSummary()
                .then((summary: FinancialPlanning.Common.Users.IUserSummary) =>
                {
                    this.name = summary.name;
                    this.balance = summary.balance;
                })
        }

        public isActive(path: string): boolean
        {
            return this.$location.path() === '/home' + path;
        }
    }
}