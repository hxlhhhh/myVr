(function (app) {
    'use strict';
    app.factory('userScoreService', function ($http, $q) {
        return {
            batchDel: function (obj) {
                var url = "/api/userExaminations/batchDel";
                var deferred = $q.defer();
                $http.post(url,obj).then(
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
            delById:function(id){
                var url = "/api/userExaminations/deleteById?id="+id;
                var deferred = $q.defer();
                $http.delete(url).then(
                    function success(respData) {
                        console.log(respData)
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
