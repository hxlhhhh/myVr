(function (app) {
    'use strict';
    app.factory('examinationService', function ($http, $q) {
        return {
            updateExamination: function (id, examination,paperIds,userIds) {
                var url = "/api/examinations/update?examinationId="+id;
                var deferred = $q.defer();
                $http.put(url, {examination:examination,paperIds:paperIds,userIds:userIds}).then(
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
            getExaminationById:function(id){
                var url = "/api/examinations/getById?examinationId="+id;
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
            delExaminationById:function(id){
                var url = "/api/examinations/"+id;
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
            addExamination:function(examination,paperIds){
                var url = "/api/examinations/save";
                var deferred = $q.defer();
                $http.post(url, {examination:examination,paperIds:paperIds}).then(
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
            getAllExaminations:function(){
                var url = "/api/examinations/getAllExam";
                var deferred = $q.defer();
                $http.get(url).then(
                    function success(respData) {
                        var examination = respData.data;
                        console.log(examination);
                        deferred.resolve(examination);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
            batchDel:function(obj){
                var url = "/api/examinations/batchDel";
                var deferred = $q.defer();
                $http.post(url,obj).then(
                    function success(respData) {
                        var examination = respData.data;
                        console.log(examination);
                        deferred.resolve(examination);
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
