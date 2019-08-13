app.controller('examinationCategoryCtrl',
    ['$scope','$compile','$state', '$stateParams','examinationCategoryService',
        function($scope,$compile,$state,$stateParams,examinationCategoryService){
            $scope.category = {
                "name":""
            };
            $scope.isAdd = "1";
            $scope.tittleText = "添加分类";
            $scope.usCategory = {};
            var params = $scope.category;
            var tableList = new CategoryTableList($scope,$compile,params);
            tableList.init();
            tableList.initEvents();
            $scope.blurFun=function(){
                tableList.refresh();
            }
            //编辑
            $scope.edit = function(id){
                var promise = examinationCategoryService.getCategoryBy(id);
                promise.then(function(data){
                    console.log(data);
                    if(data['code'] == '0x0000'){
                        $scope.isAdd = "0";
                        $scope.tittleText = "编辑分类";
                        var obj = data['data'];
                        $scope.usCategory.id = obj['_id'];
                        $scope.usCategory.name = obj['name'];
                        $scope.usCategory.desc = obj['desc'];
                        $("#usCategoryModal").modal('show');
                    }else{
                        //查询失败 zhushiluxh
                    }
                });
            };
            $scope.mangerExercise= function(id){};
            //删除
            $scope.delete = function(id){
                var promise = examinationCategoryService.delCategoryById(id);
                promise.then(function(obj){
                    tableList.refresh(1);
                });
            }
            //添加
            $scope.btnAdd = function(){
                $scope.isAdd = "1";
                $scope.tittleText = "添加分类";
                $("#usCategoryModal").modal('show');
            }
            //model对应的添加按钮
            $scope.modelAdd = function(){
                var promise = examinationCategoryService.addCategory($scope.usCategory);
                promise.then(function(data){
                    $("#usCategoryModal").modal('hide');
                    tableList.refresh();
                });
            }
            //model对应的更新按钮
            $scope.modelUpdate = function(){
                var promise = examinationCategoryService.updateCategory($scope.usCategory.id,$scope.usCategory);
                promise.then(function(data){
                    $("#usCategoryModal").modal('hide');
                    tableList.refresh();
                });
            }
            //当模态对话框关闭时，清空数据
            $("#usCategoryModal").on("hidden.bs.modal",()=>{
                $scope.usCategory.name = "";
                $scope.usCategory.desc = "";
            })
            //删除
            $scope.btnDelete = function(){
                var idList = tableList.selectIds;
                if(idList.length == 0){
                    myVr_warn("请选择删除的数据",function(){
                        return;
                    });
                }else{
                    var promise = examinationCategoryService.batchDel({idList:idList});
                    promise.then(function(msg){
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
                            myVr_error("删除失败",msg['message']);
                        }
                    }).catch(function(){
                        myVr_error("删除失败",msg['message']);
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
