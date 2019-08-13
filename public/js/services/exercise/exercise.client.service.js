(function (app) {
    'use strict';
    app.factory('exerciseService', function ($http, $q) {
        return {
            //批量删除
            batchDel: function (obj) {
                var url = "/api/exercise/batchDel";
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
            getExerciseById:function(id){
                var url = "/api/exercise/getExerciseById?exerciseId="+id;
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
            delExerciseById:function(id){
                var url = "/api/exercise/deleteById?exerciseId="+id;
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
            //更新习题
            updateExercise:function(id,obj){
                var url = "/api/exercise/updateExercise?exerciseId="+id;
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
            addExercise:function(exercise){
                var url = "/api/exercise/addExercise";
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

            getExersByPaperId: function (paperId) {
                var url = "/api/exercises/getByPaperId?paperId="+paperId;
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
