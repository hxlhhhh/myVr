(function (app) {
    'use strict';
    app.factory('examinationUserService', function ($http, $q) {
        return {
            getExaminationsByUserId: function (userId) {
                var url = "/api/userExaminations/getExaminationByUserId?userId="+userId;
                var deferred = $q.defer();
                $http.get(url).then(
                    function success(respData) {
                        var data = respData.data;
                        var result = [];
                        for (var i = 0; i < data.length; i++) {
                            var obj = {};
                            var dataI = data[i];
                            obj = dataI.examinationId;
                            obj['score'] = dataI['score'];
                            obj['status'] = dataI['status'];
                            obj['relId'] = dataI['_id'];
                            result.push(obj);
                        }
                        deferred.resolve(result);
                    },
                    function error(reason) {
                        deferred.reject(reason);
                    }
                );
                return deferred.promise;
            },
            //更新考试
            updateUserExamination(id,obj){
                var url = "/api/userExaminations/updateUserExamination?id="+id;
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
            //预约考试
            orderExamination(id,obj){
                var url = "/api/userExaminations/orderExamination?id="+id;
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
            }
        }
    });
})(angular.module('app'));
