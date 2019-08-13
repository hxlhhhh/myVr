(function (app) {
    'use strict';
    app.controller('MainController', function ($scope, $rootScope,$state,$stateParams, movies) {
        $rootScope.title = 'express_demo2';
        $scope.movies = movies;
        console.log("cecececece")
        console.log($stateParams)
        console.log("cecececece")
        $scope.updateMovie = function (movie) {
            $state.go('movie.update', {data: movie});
        };
    });
})(angular.module('app'));