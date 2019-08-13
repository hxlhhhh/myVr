(function (app) {
    'use strict';
    app.factory('noticeService', function ($http, $q) {
        return {
            //批量删除
            batchDel: function (obj) {
                var url = "/api/notice/batchDel";
                var deferred = $q.defer();
                $http.put(url,obj).then(
                    function success(respData) {
                        deferred.resolve(respData.data);
                    },
                    function error(reason) {
                        deferred.reject(reason.data);
                    }
                );
                return deferred.promise;
            },
            getNoticeById:function(id){
                var url = "/api/notice/getById?noticeId="+id;
                var deferred = $q.defer();
                $http.get(url).then(
                    function success(respData) {
                        var category = respData.data;
                        deferred.resolve(category);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
            delNoticeById:function(id){
                var url = "/api/notice/deleteById?noticeId="+id;
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
            //更新习题
            updateNotice:function(id,obj){
                var url = "/api/notice/update?noticeId="+id;
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
            //添加一个试题
            addNotice:function(notice){
                var url = "/api/notice/save";
                var deferred = $q.defer();
                $http.post(url, notice).then(
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


        }
    });
})(angular.module('app'));
