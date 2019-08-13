app.controller('userScoreCtrl',
    ['$scope','$compile','$state', '$stateParams','userScoreService',
        function($scope,$compile,$state,$stateParams,userScoreService){
            $scope.userScore = {
                examName:""
            };
            var params = $scope.exercise;
            var tableList = new UserScoreTableList($scope,$compile,params);
            tableList.init();
            tableList.initEvents();
            $scope.blurFun=function(){
                tableList.refresh();
            }
            //删除
            $scope.delete = function(id){
                var promise = userScoreService.delById(id);
                promise.then(function(msg){
                    var code = msg['code'];
                    if( code == '0x0000'){
                        myVr_alert("删除成功",function(){
                            tableList.refresh(1);
                            tableList.resetIds();
                        },null)
                    }else{
                        myVr_text_error("删除失败",msg['message'],function(){},function(){})
                    }
                    //
                }).catch(function (msg) {
                    myVr_text_error("删除失败",msg['message'],function(){},function(){})
                });
            }
            //添加
            $scope.btnAdd = function(){
                $scope.isUpdate = "0";
                $state.go('app.examination.exerciseUpdate',{data:null,isUpdate:"0"}) ;
            }
            //批量删除
            $scope.btnDelete = function(){
                var idList = tableList.selectIds;
                if(idList.length == 0){
                    myVr_warn("请选择删除的数据",function(){
                        return;
                    });
                }else{
                    var pro = userScoreService.batchDel({idList:idList});
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
        }]);
