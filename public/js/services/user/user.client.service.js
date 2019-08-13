(function (app) {
    'use strict';
    app.factory('userService', function ($http, $q) {
        return {
            userSignup:function(user){
                var url = "/api/users/";
                var deferred = $q.defer();
                $http.post(url, user).then(
                    function success(respData) {
                        deferred.resolve(respData.data);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
            userSignin:function(user){
                var url = "/api/users/signin";
                var deferred = $q.defer();
                $http.post(url, user).then(
                    function success(respData) {
                        var data = respData.data;
                        deferred.resolve(data)
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
            userSignout:function(){
                var url = "/api/users/signout";
                var deferred = $q.defer();
                $http.get(url).then(
                    function success(respData) {
                        var data = respData.data;
                        deferred.resolve(data);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
            getUserByRoles:function(roles){
                var url = "/api/users/getUserByRoles?roles="+roles;
                var deferred = $q.defer();
                $http.get(url).then(
                    function success(respData) {
                        var data = respData.data;
                        deferred.resolve(data);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
            getUserById:function(id){
                var url = "/api/users/getUserById?userId="+id;
                var deferred = $q.defer();
                $http.get(url).then(
                    function success(respData) {
                        deferred.resolve(respData.data);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
        }
    });
})(angular.module('app'));
