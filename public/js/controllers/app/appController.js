'use strict';
app.controller('appController',
    ['$scope','$state','Authentication','userService','navService',
        function($scope,$state,Authentication,userService,navService){
            var vm = this;

            vm.authentication = Authentication;
            let userGroupId = vm.authentication.userGroupId;
            $scope.signOut = function(){
                var promise = userService.userSignout();
                //退出
                promise.then(function(msg){
                    if(msg['code'] == '0x0000'){
                        $state.go('authentication.signin')
                    }
                })
            }

            //左边导航栏
            let menuPromise = navService.getMenusByUserGroupId(userGroupId);
            menuPromise.then(function(msg){
                console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
                if(msg['code'] == '0x0000'){
                    vm.menus = msg['data']['menus'];
                }
                console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
            })
        }]
);
