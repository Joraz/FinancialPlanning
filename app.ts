/**
 * Created by Daniel on 30/06/2015.
 */

/// <reference path="typings/tsd.d.ts" />

var app = angular.module('financialPlanning', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
    ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) =>
    {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl'
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl'
            });

        $urlRouterProvider.otherwise('home');
    }]);

app.controller('MainCtrl', [
    '$scope', 'posts', ($scope: any, posts: any) =>
    {
        $scope.test = 'Hello World!';

        $scope.posts = posts.posts;

        $scope.addPost = () =>
        {
            if (!$scope.title || $scope.title === '')
            {
                return;
            }
            $scope.posts.push({
                title: $scope.title,
                link: $scope.link,
                upvotes: 0,
                comments: [
                    {author: 'Joe', body: 'Cool post!', upvotes: 0},
                    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
                ]
            });
            $scope.title = '';
            $scope.link = '';
        };

        $scope.incrementUpvotes = (post) =>
        {
            post.upvotes += 1;
        }

    }
]);

app.controller('PostsCtrl', [
    '$scope',
    '$stateParams',
    'posts',
    ($scope, $stateParams, posts) =>
    {
        $scope.post = posts.posts[$stateParams.id];
    }
]);

app.factory('posts', [() =>
{
    var o = {
        posts: []
    };

    return o;
}]);