app.controller('noticeCtrl',
    ['$scope','$compile','$state', '$stateParams','Authentication','noticeService',
        function($scope,$compile,$state,$stateParams,Authentication,noticeService){
            var userId = Authentication.userId;
            $scope.notice = {
                "name":""
            };
            $scope.isAdd = "1";
            $scope.tittleText = "添加公告";
            $scope.TheNotice = {};
            var params = $scope.notice;
            var tableList = new NoticeTableList($scope,$compile,params);
            tableList.init();
            tableList.initEvents();
            $scope.blurFun=function(){
                tableList.refresh();
            }
            //编辑
            $scope.edit = function(id){
                var promise = noticeService.getNoticeById(id);
                promise.then(function(data){
                    if(data['code'] == '0x0000'){
                        $scope.isAdd = "0";
                        $scope.tittleText = "编辑公告";
                        var obj = data['data'];
                        $scope.TheNotice.id = obj['_id'];
                        $scope.TheNotice.name = obj['name'];
                        $scope.TheNotice.content = obj['content'];
                        $("#TheNoticeModal").modal('show');
                    }else{
                        //查询失败 zhushiluxh
                    }
                });
            };
            //删除
            $scope.delete = function(id){
                var promise = noticeService.delNoticeById(id);
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
            }
            //添加
            $scope.btnAdd = function(){
                $scope.isAdd = "1";
                $scope.tittleText = "添加公告";
                $("#TheNoticeModal").modal('show');
            }
            //model对应的添加按钮
            $scope.modelAdd = function(){
                $scope.TheNotice.owner=userId;
                var promise = noticeService.addNotice($scope.TheNotice);
                promise.then(function(data){
                    $("#TheNoticeModal").modal('hide');
                    tableList.refresh();
                });
            }
            //model对应的更新按钮
            $scope.modelUpdate = function(){
                var promise = noticeService.updateNotice($scope.TheNotice.id,$scope.TheNotice);
                promise.then(function(data){
                    $("#TheNoticeModal").modal('hide');
                    tableList.refresh();
                });
            }
            //当模态对话框关闭时，清空数据
            $("#TheNoticeModal").on("hidden.bs.modal",()=>{
                $scope.TheNotice.name = "";
                $scope.TheNotice.content = "";
            })
            //删除
            $scope.btnDelete = function(){
                var idList = tableList.selectIds;
                let length = idList.length;
                if(length == 0){
                    myVr_warn("请选择删除的数据",function(){
                        return;
                    });
                }else{
                    let pro = noticeService.batchDel({idList:idList});
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
            $scope.showNotice = function(id) {
                var promise = noticeService.getNoticeById(id);
                promise.then(function(data) {
                    if (data['code'] == '0x0000') {
                        let $showModal = $("#showModal");
                        let obj = data['data'];
                        $scope.showNoticeObj = obj;
                        $showModal.modal('show');
                    } else {
                        //查询失败 zhushiluxh
                    }
                })
            }


        }]);
