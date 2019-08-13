//用户组列表controller
app.controller('userGroupCtrl',
    ['$scope','$compile','$state', '$stateParams','userGroupService',
        function($scope,$compile,$state,$stateParams,userGroupService){
            $scope.userGroup = {
                "name":""
            };
            var params = $scope.userGroup;
            var tableList = new UserGroupTableList($scope,$compile,params);
            tableList.init();
            tableList.initEvents();
            $scope.blurFun=function(){
                tableList.refresh();
            }
            //编辑
            $scope.edit = function(id){
               var promise = userGroupService.getUserGroupById(id);
                promise.then(function(data){
                    if(data['code'] == '0x0000'){
                        $state.go('app.yonghu.userGroupUpdate',{data:data['data'],isUpdate:"1"}) ;
                    }else{
                        //查询失败 zhushiluxh
                    }
                });
            };
            //删除
            $scope.delete = function(id){
                myVr_warn("确定删除?",function(){
                    var promise = userGroupService.delUserGroupById(id);
                    promise.then(function(msg){
                        var code = msg['code'];
                        if( code == '0x0000'){
                            tableList.refresh(1);
                        }else{
                            myVr_text_error("删除失败",msg['message'],function(){},function(){})
                        }
                        //
                    }).catch(function (msg) {
                        myVr_text_error("删除失败",msg['message'],function(){},function(){})
                    });
                },function(){})
            }
            //添加
            $scope.btnAdd = function(){
                $state.go('app.yonghu.userGroupUpdate',{data:null,isUpdate:"0"}) ;
            }
            //批量删除
            $scope.btnDelete = function(){
                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                var idList = tableList.selectIds;
                console.log(idList);
                if(idList.length == 0){
                    myVr_warn("请选择删除的数据",function(){
                        return;
                    });
                }else{
                    var pro = userGroupService.batchDel({idList:idList});
                    pro.then(function(msg){
                        var code = msg['code']
                        if(code == '0x0000'){
                            myVr_alert("删除成功",function(){
                                tableList.resetIds();
                                tableList.refresh(idList.length);
                            },function(){
                                tableList.resetIds();
                                tableList.refresh(idList.length);
                            })
                        }else{
                            myVr_error("删除失败",msg['message'])
                        }
                    }).catch(function(data){
                        myVr_error("删除失败",function(){
                        },function(){})
                    });
                }
            }
            //刷新
            $scope.btnRefresh = function(){
                tableList.refresh();
            }
            //重置
            $scope.btnReset = function(){
            }
        }]);

//用户组更新、添加controller
app.controller('userGroupUpdateCtrl',
    ['$scope','$state', '$stateParams','userGroupService','menuService',
        function($scope,$state,$stateParams,userGroupService,menuService){
            $scope.userGroup = $stateParams.data == null?{}:$stateParams.data;
            console.log($scope.userGroup)
            var isUpdate = $scope.isUpdate = $stateParams.isUpdate == null?"1":$stateParams.isUpdate;
            if(isUpdate == "1"){
                $scope.titleContent = "更新用户组";
            }else{
                $scope.titleContent = "添加用户组";
            }
            var parentChildMap = {};
            let allMenuPromise = menuService.getAll();
            $scope.allMenus = [];
            $scope.selected = [];
            allMenuPromise.then(function(msg){
                if(msg['code']== '0x0000'){
                    var data = msg['data'];
                    console.log("datadata")
                    console.log(data)
                    console.log("datadata")
                    $scope.allMenus = data;
                    buildMenuParentChilemap(data);
                    initSelected($scope.userGroup['menus']);
                }else{

                }
            })
            var initSelected = function(menus){
                if(menus != undefined){
                    let length = menus.length;
                    for (let i = 0; i < length; i++) {
                        var menu = menus[i];
                        $scope.selected.push(menu['_id']);
                    }
                }
            }
            var buildMenuParentChilemap = function(menus){
                let length = menus.length;
                for (let i = 0; i < length; i++) {
                    var parentMenu = menus[i];
                    var parentId = parentMenu['_id'];
                    parentChildMap[parentId] = parentMenu['childList'];
                }
            }
            //判断是在集合$scope.selected里去掉此id，还是加上id
            /**
             * 处理单选
             * @param $event
             * @param id
             */
            $scope.updateSelection = function ($event, id) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                console.log(action)
                updateSelected(action, id);
            }
            function updateSelected(action, id) {
                if (action == 'add' && $scope.selected.indexOf(id) == -1) {
                    $scope.selected.push(id);
                }
                if (action == 'remove' && $scope.selected.indexOf(id) != -1) {
                    var idx = $scope.selected.indexOf(id);
                    $scope.selected.splice(idx, 1);
                }
            }
            /**
             * 处理全选/全不选
             * @param $event
             * @param id
             */
            $scope.clickAllSelect = function($event,id){
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                handleAllSelect(action,id);
            }
            function handleAllSelect(action,id){
                let childList = parentChildMap[id];
                let index = $scope.selected.indexOf(id)
                if(childList != null && childList !=undefined){
                    let length = childList.length;
                    if (action == 'add') {
                        if(index == -1){
                            $scope.selected.push(id);
                        }
                        for (let i = 0; i < length; i++) {
                            var childId = childList[i]['_id'];
                            if($scope.selected.indexOf(childId) == -1){
                                $scope.selected.push(childId);
                            }
                        }
                    }
                    if (action == 'remove'){
                        if(index != -1){
                            $scope.selected.splice(index,1);
                        }
                        for (let i = 0; i < length; i++) {
                            var childId = childList[i]['_id'];
                            let index = $scope.selected.indexOf(childId);
                            if(index != -1){
                                $scope.selected.splice(index,1)
                            }
                        }
                    }
                }else{
                    if (action == 'add') {
                        if(index == -1)
                            $scope.selected.push(id);
                    }else if (action == 'remove') {
                        if (index != -1)
                            $scope.selected.splice(index, 1);
                    }
                }
            }
            //设置全选框的选中状态
            $scope.isSelectedAlldddd = function(id){
                let childList = parentChildMap[id];
                let isAllSelect = false;
                if(childList != null && childList != undefined){
                    let length = childList.length;
                    let allSelectLength = 0;
                    for (let i = 0; i < length; i++) {
                        let childId = childList[i]['_id'];
                        if($scope.selected.indexOf(childId) != "-1"){
                            allSelectLength ++;
                        }
                    }
                    let index = $scope.selected.indexOf(id);
                    //全不选
                    if(allSelectLength == 0){
                        if(index != -1){
                            $scope.selected.splice(index,1);
                        }
                    }else if(allSelectLength == length){
                        if(index == -1){
                            $scope.selected.push(id);
                        }
                        isAllSelect = true;
                    }else{
                        if(index == -1){
                            $scope.selected.push(id);
                        }
                    }
                }else{
                    let index = $scope.selected.indexOf(id);
                    if (index != -1){
                        isAllSelect = true;
                    }
                }
                console.log("======================")
                console.log($scope.selected);
                console.log("======================")
                return isAllSelect;
            }
            //设置复选框的选中状态
            $scope.isSelected = function (id) {
                return $scope.selected.indexOf(id) >= 0;
            }
            //更新
            $scope.update = function(){
                var promise = userGroupService.updateUserGroup($scope.userGroup._id,$scope.userGroup,$scope.selected);
                promise.then(function(data){
                    var code = data['code'];
                    if(code == "0x0000"){
                        myVr_alert("修改成功",function(){
                            $state.go('app.yonghu.userGroupList');
                        },function(){

                        })
                    }else{

                    }
                }).catch(function(data){
                    myVr_error("修改失败",function(){
                        $state.go('app.examination.paperList');
                    },function(){
                    })
                });
            }
            //添加
            $scope.add = function(){
                var promise = userGroupService.addUserGroup($scope.userGroup,$scope.selected);
                promise.then(function(msg){
                    if(msg['code'] == '0x0000'){
                        myVr_alert("添加成功",function(){
                            $state.go('app.yonghu.userGroupList');
                        },function(){
                            console.log("点击了取消");
                        })
                    }else{
                        myVr_text_error("添加失败",msg['message'],function(){
                            $state.go('app.yonghu.userGroupList');
                        },function(){
                            console.log("点击了取消");
                        })
                    }
                })
            }
            //返回
            $scope.back = function(){
                $state.go('app.yonghu.userGroupList');
            }
        }]);
