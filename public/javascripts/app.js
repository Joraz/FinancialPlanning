/// <reference path="../../reference.ts" />
var FinancialPlanning;
(function (FinancialPlanning) {
    var app = angular.module('financialPlanning', ['ui.router']).controller('loginController', FinancialPlanning.LoginController).service('loginService', FinancialPlanning.LoginService);
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state("login", {
            templateUrl: "templates/login.html",
            controller: "loginController",
            url: "/login"
        });
        $urlRouterProvider.otherwise('/login');
    }]);
})(FinancialPlanning || (FinancialPlanning = {}));
//# sourceMappingURL=app.js.map