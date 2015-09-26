/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class HomeController implements IHomeController
    {
        public name: string;
        public balance: number;

        public static $inject = ['$scope', '$location', 'loginService', 'toasty'];

        constructor(public $scope: IHomeControllerScope, public $location: ng.ILocationService,
                    private loginService: ILoginService, public toasty: toasty.IToastyService)
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
                    if (summary.limitWarning)
                    {
                        if (summary.balance < summary.limitWarning)
                        {
                            this.toasty.warning({
                                title: "Warning",
                                msg: "Your balance has dropped below your configured warning limit"
                            });
                        }
                    }
                })
        }

        public isActive(path: string): boolean
        {
            return this.$location.path() === '/home' + path;
        }
    }
}