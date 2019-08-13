(function (app) {
    'use strict';
    app.factory('navService', function ($http, $q) {
        return {
            getMenusByUserGroupId:function(userGroupId){
                var url = "/api/userGroup/getById2?userGroupId="+userGroupId;
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
