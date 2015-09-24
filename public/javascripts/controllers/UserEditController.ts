/// <reference path="../../../reference.ts" />

module FinancialPlanning
{
    export class UserEditController implements IUserEditController
    {
        public preferredName: string;
        public lowLimitWarning: number;
        public password: string;

        public static $inject = ['$scope', 'userData', 'loginService', 'toasty'];

        constructor(public $scope: IUserEditControllerScope, userData: FinancialPlanning.Common.Users.IUserDetails,
                    public loginService: ILoginService, public toasty: toasty.IToastyService)
        {
            $scope.vm = this;
            this.preferredName = userData.preferredName;
            this.lowLimitWarning = userData.lowLimitWarning;
            this.password = "";
        }

        public saveUserDetails(): void
        {
            let password = this.password === "" ? null : this.password;
            this.loginService.updateUser(this.preferredName, this.lowLimitWarning, password)
                .then((response: any) =>
                {
                    this.$scope.$emit('balanceUpdateRequired');
                    this.toasty.success({
                        title: "Success!",
                        msg: "User details saved"
                    });
                })
                .catch((error: any) =>
                {
                    this.toasty.error({
                        title: "Error saving user details",
                        msg: error.data
                    });
                });
        }
    }
}