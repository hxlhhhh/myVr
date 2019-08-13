(function (app) {
    'use strict';
    app.factory('characterService', function ($http, $q) {
        return {
            //添加一个用户
            addUser:function(user){
                var url = "/api/users/addUser";
                var deferred = $q.defer();
                $http.post(url, user).then(
                    function success(respData) {
                        var msg = respData.data;
                        deferred.resolve(msg);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
            deleteUserById:function(id){
                var url = "/api/users/deleteById?userId="+id;
                var deferred = $q.defer();
                $http.delete(url).then(
                    function success(respData) {
                        deferred.resolve(respData.data);
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
            updateUser:function(userId,user){
                var url = "/api/users/updateUser?userId="+userId;
                var deferred = $q.defer();
                $http.put(url, user).then(
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
            batchDel:function(obj){
                var url = "/api/users/batchDel";
                var deferred = $q.defer();
                $http.put(url, obj).then(
                    function success(respData) {
                        var data = respData.data;
                        deferred.resolve(data);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            }
        }
    });
})(angular.module('app'));
