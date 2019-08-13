(function (app) {
    'use strict';
    app.factory('signinService', function ($http, $q) {
        return {
            signin: function (obj) {
                var url = "http://localhost:8080/api/signin/userSignin";
                var deferred = $q.defer();
                $http.post(url,obj).then(
                    function success(respData) {
                        deferred.resolve(respData.data);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
            getByUserId:function(userId){
                var url = "/api/signin/getByUserId?userId="+userId;
                var deferred = $q.defer();
                $http.get(url).then(
                    function success(respData) {
                        var signin = respData.data;
                        deferred.resolve(signin);
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
        }
    });
})(angular.module('app'));
