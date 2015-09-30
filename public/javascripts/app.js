/// <reference path="../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    // Create the application and add controllers & services
    var app = angular.module('financialPlanning', ['ui.router', 'angular-toasty', 'chart.js', 'ui.bootstrap'])
        .controller('loginController', FinancialPlanning.LoginController)
        .controller('homeController', FinancialPlanning.HomeController)
        .controller('userController', FinancialPlanning.UserController)
        .controller('transactionTypeController', FinancialPlanning.TransactionTypeController)
        .controller('chartController', FinancialPlanning.ChartController)
        .controller('transactionController', FinancialPlanning.TransactionController)
        .controller('userEditController', FinancialPlanning.UserEditController)
        .controller('modalController', function ($scope, $modalInstance, $state, loginService, toasty) {
        $scope.confirm = function () {
            loginService.deleteUser()
                .then(function () {
                $modalInstance.close();
                $state.go("login");
                toasty.success("User account deleted");
            })
                .catch(function () {
                toasty.error("Could not delete user");
            });
        };
    })
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
                    },
                    balanceSummaries: function (loginService) {
                        return loginService.getBalanceSummary(moment().subtract(30, "day").toDate(), new Date());
                    },
                    balanceForecast: function (loginService) {
                        return loginService.getBalanceForecast();
                    },
                    incomingTotals: function (transactionService) {
                        return transactionService.getIncomingTotals();
                    },
                    outgoingTotals: function (transactionService) {
                        return transactionService.getOutgoingTotals();
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
                    },
                    recurringTransactions: function (transactionService) {
                        return transactionService.getRecurringTransactionInstances();
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
        .config(['ChartJsProvider', function (ChartJsProvider) {
            ChartJsProvider.setOptions('Bar', {
                colours: ['#1266AA', '#EB7933']
            });
            ChartJsProvider.setOptions('Doughnut', {
                colours: ['#39AA4E', '#55BCA7', '#367AB7', '#605298', '#8C68A6', '#A974AC', '#AA3866', '#E75935',
                    '#ED7D3B', '#F7BC4E', '#F9ED5B', '#BDD44D']
            });
            ChartJsProvider.setOptions('Line', {
                colours: ['#1A663A']
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