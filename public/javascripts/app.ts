/// <reference path="../../reference.ts" />

module FinancialPlanning
{
    var app = angular.module('financialPlanning', ['ui.router', 'angular-toasty', 'chart.js', 'ui.bootstrap'])
        .controller('loginController', LoginController)
        .controller('homeController', HomeController)
        .controller('userController', UserController)
        .controller('transactionTypeController', TransactionTypeController)
        .controller('chartController', ChartController)
        .controller('transactionController', TransactionController)
        .controller('userEditController', UserEditController)
        .service('loginService', LoginService)
        .service('transactionService', TransactionService);

    app
        .config(['$stateProvider', '$urlRouterProvider', ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) =>
        {
            $stateProvider
                .state("login", {
                    templateUrl: "templates/login.html",
                    controller: "loginController",
                    url: "/login",
                    data: {
                        authenticate: false
                    }
                })
                .state("createUser", {
                    templateUrl: "templates/new-user.html",
                    controller: "userController",
                    url: "/create-user",
                    data: {
                        authenticate: false
                    }
                })
                .state("home", {
                    templateUrl: "templates/home.html",
                    controller: "homeController",
                    url: "/home",
                    data: {
                        authenticate: true
                    }
                })
                .state("home.charts", {
                    templateUrl: "templates/charts.html",
                    controller: "chartController",
                    url: "/charts",
                    data: {
                        authenticate: true
                    },
                    resolve: {
                        transactionSummaries: (transactionService: ITransactionService) =>
                        {
                            return transactionService.getTransactionSummaries(moment().subtract(30, "day").toDate(), new Date());
                        }
                    }
                })
                .state("home.transactionTypes", {
                    templateUrl: "templates/transaction-types.html",
                    controller: "transactionTypeController",
                    url: "/transaction-types",
                    data: {
                        authenticate: true
                    },
                    resolve: {
                        transactionTypes: (transactionService: ITransactionService) =>
                        {
                            return transactionService.getTransactionTypes();
                        }
                    }
                })
                .state("home.transactions", {
                    templateUrl: "templates/transactions.html",
                    controller: "transactionController",
                    url: "/transactions",
                    data: {
                        authenticate: true
                    },
                    resolve: {
                        transactionTypes: (transactionService: ITransactionService) =>
                        {
                            return transactionService.getTransactionTypes();
                        },
                        transactionSummaries: (transactionService: ITransactionService) =>
                        {
                            return transactionService.getTransactionSummaries(moment().subtract(30, 'day').toDate(), moment().toDate());
                        }
                    }
                })
            .state("home.editUser", {
                    templateUrl: "templates/edit-user.html",
                    controller: "userEditController",
                    url: "/edit-user",
                    data: {
                        authenticate: true
                    },
                    resolve: {
                        userData: (loginService: ILoginService) =>
                        {
                            return loginService.getUserDetails();
                        }
                    }
                });

            $urlRouterProvider.otherwise('/login');
        }])
        .config(['toastyConfigProvider', (toastyConfigProvider: toasty.IToastyConfigProvider) =>
        {
            toastyConfigProvider.setConfig({
                limit: 3,
                showClose: false,
                clickToClose: true,
                position: 'top-left',
                sound: false,
                shake: false,
                html: true,
                theme: 'bootstrap'
            })
        }])
        .run(['$rootScope', '$state', 'loginService', 'toasty',
            ($rootScope: FinancialPlanning.IAppRootScope, $state: ng.ui.IStateService,
             loginService: FinancialPlanning.ILoginService, toasty: toasty.IToastyService) =>
            {
                $rootScope.$on('$stateChangeError', (event: ng.IAngularEvent, toState: ng.ui.IState, toParams: any,
                                                     fromState: ng.ui.IState, fromParams: any, error: any) =>
                {
                    console.info("$stateChangeError");
                    if (error && error.status && error.status === 401)
                    {
                        event.preventDefault();
                        $state.go('login');
                    }
                    else
                    {
                        console.info(error);
                        toasty.error({
                            title: "State Change Error",
                            msg: error.message
                        });
                    }
                });

                $rootScope.$on('$stateChangeStart', (event: ng.IAngularEvent, toState: ng.ui.IState, toParams: any, fromState: ng.ui.IState) =>
                {
                    var requiresLogin = toState.data.authenticate;

                    if (requiresLogin && requiresLogin === true)
                    {
                        event.preventDefault();

                        loginService.checkLoginStatus()
                            .then((isLoggedIn: boolean) =>
                            {
                                if (isLoggedIn)
                                {
                                    console.log("Transitioning from state: " + fromState.name + " to state: " + toState.name);
                                    $state.go(toState.name, toParams, {notify: false})
                                        .then(() =>
                                        {
                                            $rootScope.$broadcast('$stateChangeSuccess', toState, toParams);
                                        });
                                }
                                else
                                {
                                    toasty.error({
                                        title: "Unauthorised",
                                        msg: "You must be logged in to access that resource"
                                    });
                                    $state.go("login");
                                }
                            })
                            .catch((error: any) =>
                            {
                                toasty.error({
                                    title: "State Change Error",
                                    msg: error.message
                                });
                            });
                    }
                    else
                    {
                        console.log("Transitioning from state: " + fromState.name + " to state: " + toState.name);
                        $state.go(toState.name, toParams, {notify: false})
                            .then(() =>
                            {
                                $rootScope.$broadcast('$stateChangeSuccess', toState, toParams);
                            });
                    }
                })
            }]);
}