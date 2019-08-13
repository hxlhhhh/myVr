(function (app) {
    'use strict';
    app.factory('userGroupService', function ($http, $q) {
        return {
            batchDel: function (obj) {
                var url = "/api/userGroup/batchDel"
                var deferred = $q.defer();
                $http.put(url,obj).then(
                    function success(respData) {
                        deferred.resolve(respData.data);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
            //根据id查询
            getUserGroupById:function(id){
                var url = "/api/userGroup/getById?userGroupId="+id;
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
            //删除
            delUserGroupById:function(id){
                var url = "/api/userGroup/deleteById?userGroupId="+id;
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
            //更新
            updateUserGroup:function(id,obj,menuIds){
                var url = "/api/userGroup/updateUserGroup?userGroupId="+id;
                var deferred = $q.defer();
                $http.put(url, {userGroup:obj,menuIds:menuIds}).then(
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
            //添加
            addUserGroup:function(obj,menuIds){
                var url = "/api/userGroup/addUserGroup";
                var deferred = $q.defer();
                $http.post(url, {userGroup:obj,menuIds:menuIds}).then(
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
            //获取所有
            getAll:function(){
                var url = "/api/paper/getAll";
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

            getAllUserGroup:function(){
                var url = "/api/userGroup/getAll";
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
        }
    });
})(angular.module('app'));
