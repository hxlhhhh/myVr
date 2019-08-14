app.controller('departCtrl',
    ['$scope','$compile','$state', '$stateParams','departService',
    function($scope,$compile,$state,$stateParams,departService){
    $scope.depart = {
        "name":"",
        "num":""
    };
    $scope.isAdd = "1";
    $scope.mDepart = {};
    var params = $scope.depart;
    var tableList = new departTableList($scope,$compile,params);
    tableList.init();
    tableList.initEvents();
    $scope.blurFun=function(){
        tableList.refresh();
    }

    $("#departModal").on("hidden.bs.modal",()=>{
        $scope.mDepart.name = "";
        $scope.mDepart.num = "";
    })
    //编辑
    $scope.edit = function(id){
        $scope.isAdd = "0";
        var promise = departService.getDepartById(id);
        promise.then(function(obj){
           var data = obj['data'];
           $scope.mDepart = data;
           $("#departModal").modal('show');
        });
    };
    $scope.modelUpdate = function(){
        var obj = $scope.mDepart;
        var promise = departService.updateDepart(obj["_id"],obj);
        promise.then(function(msg){
            if(msg['code'] == '0x0000'){
                myVr_alert("更新成功",function(){
                    $("#departModal").modal('hide');
                    tableList.refresh();
                },function(){
                    $("#departModal").modal('hide');
                    tableList.refresh();
                })
            }
        });
    }
    //删除
    $scope.delete = function(id){
        var promise = departService.deleteById(id);
        promise.then(function(obj){
            myVr_alert("删除成功",function(){
                tableList.refresh(1);
            },function(){})
        });
    }

    $scope.btnDelete = function(){
        var idList = tableList.selectIds;
        if(idList.length == 0){
            myVr_warn("请选择删除的数据",function(){
                return;
            });
        }else{
            var pro = departService.batchDel({idList:idList});
            pro.then(function(msg){
                var code = msg['code']
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

    //添加
    $scope.btnAdd = function(){
        $scope.isAdd = "1";
        $("#departModal").modal('show');
    }
    $scope.modelAdd = function(){
        var obj = $scope.mDepart;
        $("#departModal").modal('show');
        var promise = departService.addDepart(obj);
        promise.then(function(obj){
            myVr_alert("添加成功",function(){
                $("#departModal").modal('hide');
                tableList.refresh();
            },function(){
                $("#departModal").modal('hide');
                tableList.refresh();
            })
        });
    }
}]);




