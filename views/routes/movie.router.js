(function (app) {
    'use strict';
    app.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    app.config(routeConfig).run(function(){

    });
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider){
        $urlRouterProvider.rule(function($injector,$location){
            var path = $location.path();
            var hasTrailingSlash = path.length>1 && path[path.length - 1] === '/';
            if(hasTrailingSlash){
                var newPath = path.substr(0,path.length -1);
                $location.replace().path(newPath);
            }
        });
        $locationProvider.html5Mode(
            {
                enabled: true,
                requireBase: false
            },
        );
        $stateProvider
            .state('movie', {
                templateUrl: '/menu.html',
            })
            .state('movie.main', {
                url: '/movie',
                controller: 'MainController',
                templateUrl: '/main.html',
                resolve: {
                    movies: function (MovieService) {//往controller中注入的数据
                        var promise = MovieService.getAllMovies();
                        return promise;
                    }
                }
            })
            .state('movie.update', {
                url: '/movie/update',
                controller: 'MovieController',
                templateUrl: '/update.html',
                params: {
                    data: null,
                }
            });
        $urlRouterProvider.otherwise('/movie');
    }
})(angular.module('app'));
