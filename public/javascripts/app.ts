/// <reference path="../../reference.ts" />

module FinancialPlanning
{
    var app = angular.module('financialPlanning', ['ui.router'])
        .controller('loginController', LoginController)
        .service('loginService', LoginService);

    app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) =>
    {
        $stateProvider.state("login", {
            templateUrl: "templates/login.html",
            controller: "loginController",
            url: "/login"
        });

        $urlRouterProvider.otherwise('/login');
    }]);
}