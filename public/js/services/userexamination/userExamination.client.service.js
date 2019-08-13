(function (app) {
    'use strict';
    app.factory('userExaminationService', function ($http, $q) {
        return {
            //发布考试一个试题
            addManyObj:function(objs){
                var url = "/api/userExaminations/insertMany";
                var deferred = $q.defer();
                $http.post(url, objs).then(
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
            //获取一个考试下的所有用户
            getByExaminationId:function(examinationId){
                var url = "/api/userExaminations/getByExaminationId?examinationId="+examinationId;
                var deferred = $q.defer();
                $http.get(url).then(
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
