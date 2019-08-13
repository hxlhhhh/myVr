app.controller('CharacterCtrl',
    ['$scope','$compile','$state', '$stateParams','characterService',
    function($scope,$compile,$state,$stateParams,characterService){
        $scope.user = {
            userName:"",
            phone:"",
        }
        var params = $scope.user;
        var tableList = new YongHuTableList($scope,$compile,params);
        tableList.init();
        tableList.initEvents();
        $scope.blurFun=function(){
            tableList.refresh();
        }
        //编辑
        $scope.edit = function(id){
            var promise = characterService.getUserById(id);
            promise.then(function(obj){
                $state.go('app.yonghu.update',{data:obj.data,isUpdate:1});
            });
        };

        //删除
        $scope.delete = function(id){
            var promise = characterService.deleteUserById(id);
            promise.then(function(msg){
                if(msg['code'] == '0x0000'){
                    myVr_alert("删除成功",function(){
                        tableList.resetIds();
                        tableList.refresh(1);
                    },function(){
                        tableList.resetIds();
                    })
                }

            });
        }
        //添加
        $scope.btnAdd = function(){
            $state.go('app.yonghu.update',{data:null,isUpdate:0});
        }
        //删除
        $scope.btnDelete = function(){
            var idList = tableList.selectIds;
            if(idList.length == 0){
                myVr_warn("请选择删除的数据",function(){
                    return;
                });
            }else{
                var pro = characterService.batchDel({idList:idList});
                pro.then(function(msg){
                    var code = msg['code'];
                    if(code == '0x0000'){
                        myVr_alert("删除成功",function(){
                            tableList.refresh(idList.length);
                            tableList.resetIds();
                        },function(){
                            tableList.resetIds();
                            tableList.refresh(idList.length);
                        })
                    }
                });
            }
        }
        //刷新
        $scope.btnRefresh = function(){
             tableList.refresh();
        }
        //重置
        $scope.btnReset = function(){
            console.log("点击了重置按钮");
        }

}]);

app.controller('CharacterUpdateCtrl',
    ['$scope','$compile','$state', '$stateParams','characterService','departService','userGroupService',
    function($scope,$compile,$state,$stateParams,characterService,departService,userGroupService){
        var user = {};
        $scope.isUpdate = $stateParams.isUpdate;
        if($scope.isUpdate == "1"){
            user = $scope.user = $stateParams.data;
            $scope.titleText = "用户信息更新";
        }else{
            $scope.user = {};
            $scope.titleText = "用户信息添加";
        }
        var depart = $scope.selectDepartId = user['departId'];
        var departId = "";
        if(depart != undefined){
            departId = depart['_id'];
        }
        var departMap = {};
        $scope.departs = [];
        $scope.selectDepart = {};
        var departPromise = departService.getAllDepart();
        departPromise.then(function(msg){
            if(msg['code'] == '0x0000'){
                var departs = $scope.departs = msg['data'];
                for (let i = 0; i < departs.length; i++) {
                    var obj = departs[i];
                    var id = obj['_id'];
                    departMap[id] = obj;
                }
            }else{
                console.log("没有部门查询到，请添加部门");
            }
            $scope.selectDepart = departMap[departId];
        });


        var userGroup = $scope.selectUserGroup = user['userGroupId'];
        var userGroupId = "";
        if(userGroup != undefined){
            userGroupId = userGroup['_id'];
        }
        var userGroupMap = {};
        $scope.userGroups = [];
        $scope.selectUserGroup = {};
        var userGroupPromise = userGroupService.getAllUserGroup();
        userGroupPromise.then(function(msg){
            if(msg['code'] == '0x0000'){
                var userGroups = $scope.userGroups = msg['data'];
                for (let i = 0; i < userGroups.length; i++) {
                    var obj = userGroups[i];
                    var id = obj['_id'];
                    userGroupMap[id] = obj;
                }
            }else{
                console.log("没有分组查询到，请添加分组");
            }
            $scope.selectUserGroup = userGroupMap[userGroupId];
        });





        //更新
        $scope.update = function(){
            $scope.user['departId'] = $scope.selectDepart['_id']
            $scope.user['userGroupId'] = $scope.selectUserGroup['_id']
            var promise = characterService.updateUser($scope.user._id,$scope.user);
            promise.then(function(data){
                console.log("result");
                console.log(data)
                var code = data['code'];
                if(code == "0x0000"){
                    myVr_alert("修改成功",function(){
                        $state.go('app.yonghu.list');
                    },function(){
                        console.log("点击了取消");
                    })
                }else{

                }
            });
        }
        //添加
        $scope.add = function(){
            $scope.user['departId'] = $scope.selectDepart['_id'];
            $scope.user['userGroupId'] = $scope.selectUserGroup['_id'];
            //添加用户id
            var promise = characterService.addUser($scope.user);
            promise.then(function(msg){
                console.log(msg);
                if(msg['code'] == '0x0000'){
                    myVr_alert("添加成功",function(){
                        $state.go('app.yonghu.list');
                    },function(){
                        console.log("点击了取消");
                    })
                }else{
                    myVr_text_alert("添加失败",msg['message'],function(){
                        $state.go('app.yonghu.list');
                    },function(){
                        console.log("点击了取消");
                    })
                }
            })
        }
    $scope.back = function(){
        console.log("点击了返回按钮");
        $state.go('app.yonghu.list');
        }
    }]);
