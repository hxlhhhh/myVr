(function () {
    'use strict';
    // Authentication service for user variables
    angular
        .module('app')
        .factory('Authentication', Authentication);

    Authentication.$inject = ['$window'];

    function Authentication($window) {
        var auth = {
            setUser:function(userName){
                this.userName = userName;
                $window.localStorage.setItem("userName",userName);
            },
            removeUser:function(){
                $window.localStorage.removeItem("userName");
            },
            setRole:function(role){
                this.role = role;
                $window.localStorage.setItem("role",role);
            },
            removeRole:function(){
                $window.localStorage.removeItem("role");
            },
            setUserId:function(userId){
                this.userId = userId;
                $window.localStorage.setItem("userId",userId);
            },
            removeUserId:function(){
                $window.localStorage.removeItem("userId");
            },
            setUserGroupId:function(userGroupId){
                this.userGroupId = userGroupId;
                $window.localStorage.setItem("userGroupId",userGroupId);
            },
            removeUserGroupId:function(){
                $window.localStorage.removeItem("userGroupId");
            },
            "userId": $window.localStorage["userId"],
            "role": $window.localStorage["role"],
            "userName": $window.localStorage["userName"],
            "userGroupId": $window.localStorage["userGroupId"],
        };
        return auth;
    }
}());
