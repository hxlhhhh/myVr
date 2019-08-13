app.controller('userCtrl',
    ['$scope','$state', '$stateParams','userService','Notification','Authentication','$window',
        function($scope,$state,$stateParams,userService,Notification,Authentication,$window){
        var vm = this;
        vm.authentication = Authentication;
        vm.signup = signup;
        vm.signin = signin;
        function signup() {
            /*if (!isValid) {
                //$scope.$broadcast('show-errors-check-validity', 'vm.userForm');
                return false;
            }*/
            userService.userSignup(vm.user)
                .then(onUserSignupSuccess)
                .catch(onUserSignupError);
        }
        function onUserSignupSuccess(response){
            Notification.success({ message: "<i class='glyphicon glyphicon-ok'></i>"+response['msg'],delay: 2000});
            $state.go('authentication.signin');
        };
        function onUserSignupError(response){

        };
        function signin() {
            userService.userSignin(vm.user)
                .then(onUserSigninSuccess)
                .catch(onUserSigninError);
        }
        function onUserSigninSuccess(response) {
            if(response['code'] == '0x0000'){
                var user =  response['data'];
                console.log(user);
                vm.authentication.setUserId(user['_id']);
                vm.authentication.setUser(user['userName']);
                var role = user['roles'][0];
                vm.authentication.setRole(role);
                vm.authentication.setUserGroupId(user['userGroupId']);
                Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
                if(role == 'user'){ //user
                    $state.go('app.examination.myExams');
                }else{//admin
                    $state.go('app.examination.list');
                }

            }else{
                Notification.success({ message: "<i class='glyphicon glyphicon-ok'></i>"+response['msg']});
            }
        }
        function onUserSigninError(response) {
            //Notification.error({ message: response.data.msg, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
        }
        $scope.signout = function(){
            console.log("kkkkkkkkkkkkkkkkkkkk");
            vm.authentication.removeUser();
            vm.authentication.removeUserId();
            vm.authentication.removeRole();
            console.log("kkkkkkkkkkkkkkkkkkkk");
            userService.userSignout()
                .then(function(){})
                .catch(function(){});
        };
    }]
);
