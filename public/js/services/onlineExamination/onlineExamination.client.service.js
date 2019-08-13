(function (app) {
    'use strict';
    app.factory('onlineExaminationService', function ($http, $q) {
        return {
            getExaminationInfo: function (examinationId) {
                var url = "/api/exercises/getExerciseByExaminationById?examinationId="+examinationId;
                var deferred = $q.defer();
                $http.get(url).then(
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
            getPaperInfo: function (paperId) {
                var url = "/api/exercises/getPaperInfoById?paperId="+paperId;
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
            }

        }
    });
})(angular.module('app'));
