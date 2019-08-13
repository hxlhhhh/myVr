(function (app) {
    'use strict';
    app.factory('examinationCategoryService', function ($http, $q) {
        return {
            //获取所有数据
            getAllCategory: function () {
                var url = "/api/examinationCategory/getAll";
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
            getCategoryBy:function(id){
                var url = "/api/examinationCategory/getCategoryById?categoryId="+id;
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
            delCategoryById:function(id){
                var url = "/api/examinationCategory/deleteById?categoryId="+id;
                console.log(url)
                var deferred = $q.defer();
                $http.delete(url).then(
                    function success(respData) {
                        console.log("删除成功了");
                        deferred.resolve(respData.data);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
            //添加一张试卷
            addCategory:function(examination){
                var url = "/api/examinationCategory/save";
                var deferred = $q.defer();
                $http.post(url, examination).then(
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
            updateCategory:function(id,obj){
                var url = "/api/examinationCategory/update?categoryId="+id;
                var deferred = $q.defer();
                $http.post(url, obj).then(
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
            batchDel:function(obj){
                var url = "/api/examinationCategory/batchDel";
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
            }
        }
    });
})(angular.module('app'));
