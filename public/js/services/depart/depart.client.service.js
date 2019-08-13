(function (app) {
    'use strict';
    app.factory('departService', function ($http, $q) {
        return {
            //批量删除
            batchDel: function (obj) {
                var url = "/api/depart/batchDel";
                var deferred = $q.defer();
                $http.put(url,obj).then(
                    function success(respData) {
                        console.log(respData)
                        deferred.resolve(respData.data);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
            //删除部门
            deleteById:function(id){
                var url = "/api/depart/deleteById?departId="+id;
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
            getDepartById:function(id){
                var url = "/api/depart/getById?departId="+id;
                var deferred = $q.defer();
                $http.get(url).then(
                    function success(respData) {
                        var category = respData.data;
                        console.log(category);
                        deferred.resolve(category);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },

            //更新部门
            updateDepart:function(id,obj){
                var url = "/api/depart/update?departId="+id;
                var deferred = $q.defer();
                $http.put(url, obj).then(
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
            //添加一个部门
            addDepart:function(exercise){
                var url = "/api/depart/add";
                var deferred = $q.defer();
                $http.post(url, exercise).then(
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

            getAllDepart: function () {
                var url = "/api/depart/getAll";
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
