(function (app) {
    'use strict';
    app.factory('menuService', function ($http, $q) {
        return {
            getExersByExaminationId: function (examinationId) {
                var url = "/api/exercises/getExersByExaminationId?examinationId="+examinationId;
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
            //根据id查询试卷
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

            //删除试卷
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
            //更新试卷
            updatePaper:function(id,obj,exercises){
                var url = "/api/paper/update?paperId="+id;
                var deferred = $q.defer();
                $http.put(url, {paper:obj,exercises:exercises}).then(
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
            //添加试卷
            addPaper:function(obj,exercises){
                var url = "/api/paper/save";
                var deferred = $q.defer();
                $http.post(url, {paper:obj,exercises:exercises}).then(
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
            //获取所有试卷
            getAll:function(){
                var url = "/api/menu/getAll";
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
