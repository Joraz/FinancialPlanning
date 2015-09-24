/// <reference path="../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var app = angular.module('financialPlanning', ['ui.router', 'angular-toasty', 'chart.js', 'ui.bootstrap'])
        .controller('loginController', FinancialPlanning.LoginController)
        .controller('homeController', FinancialPlanning.HomeController)
        .controller('userController', FinancialPlanning.UserController)
        .controller('transactionTypeController', FinancialPlanning.TransactionTypeController)
        .controller('chartController', FinancialPlanning.ChartController)
        .controller('transactionController', FinancialPlanning.TransactionController)
        .controller('userEditController', FinancialPlanning.UserEditController)
        .service('loginService', FinancialPlanning.LoginService)
        .service('transactionService', FinancialPlanning.TransactionService);
    app
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
                    transactionSummaries: function (transactionService) {
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
                    transactionTypes: function (transactionService) {
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
                    transactionTypes: function (transactionService) {
                        return transactionService.getTransactionTypes();
                    },
                    transactionSummaries: function (transactionService) {
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
                    userData: function (loginService) {
                        return loginService.getUserDetails();
                    }
                }
            });
            $urlRouterProvider.otherwise('/login');
        }])
        .config(['toastyConfigProvider', function (toastyConfigProvider) {
            toastyConfigProvider.setConfig({
                limit: 3,
                showClose: false,
                clickToClose: true,
                position: 'top-left',
                sound: false,
                shake: false,
                html: true,
                theme: 'bootstrap'
            });
        }])
        .run(['$rootScope', '$state', 'loginService', 'toasty',
        function ($rootScope, $state, loginService, toasty) {
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                console.info("$stateChangeError");
                if (error && error.status && error.status === 401) {
                    event.preventDefault();
                    $state.go('login');
                }
                else {
                    console.info(error);
                    toasty.error({
                        title: "State Change Error",
                        msg: error.message
                    });
                }
            });
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                var requiresLogin = toState.data.authenticate;
                if (requiresLogin && requiresLogin === true) {
                    event.preventDefault();
                    loginService.checkLoginStatus()
                        .then(function (isLoggedIn) {
                        if (isLoggedIn) {
                            console.log("Transitioning from state: " + fromState.name + " to state: " + toState.name);
                            $state.go(toState.name, toParams, { notify: false })
                                .then(function () {
                                $rootScope.$broadcast('$stateChangeSuccess', toState, toParams);
                            });
                        }
                        else {
                            toasty.error({
                                title: "Unauthorised",
                                msg: "You must be logged in to access that resource"
                            });
                            $state.go("login");
                        }
                    })
                        .catch(function (error) {
                        toasty.error({
                            title: "State Change Error",
                            msg: error.message
                        });
                    });
                }
                else {
                    console.log("Transitioning from state: " + fromState.name + " to state: " + toState.name);
                    $state.go(toState.name, toParams, { notify: false })
                        .then(function () {
                        $rootScope.$broadcast('$stateChangeSuccess', toState, toParams);
                    });
                }
            });
        }]);
})(FinancialPlanning || (FinancialPlanning = {}));
//# sourceMappingURL=app.js.map