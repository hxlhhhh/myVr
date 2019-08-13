//试卷列表controller
app.controller('paperCtrl',
    ['$scope','$compile','$state', '$stateParams','paperService',
        function($scope,$compile,$state,$stateParams,paperService){
            $scope.paper = {
                "name":""
            };
            $scope.isAdd = "1";
            var params = $scope.paper;
            var tableList = new PaperTableList($scope,$compile,params);
            var tableObj = tableList.init();
            $scope.blurFun=function(){
                tableList.refresh();
            }
            //编辑
            $scope.edit = function(id){
               var promise = paperService.getPaperById(id);
                promise.then(function(data){
                    if(data['code'] == '0x0000'){
                        $state.go('app.examination.paperUpdate',{data:data['data'],isUpdate:"1"}) ;
                    }else{
                        //查询失败 zhushiluxh
                    }
                });
            };
            //删除
            $scope.delete = function(id){
                myVr_warn("确定删除?",function(){
                    var promise = paperService.delPaperById(id);
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
                $state.go('app.examination.paperUpdate',{data:null,isUpdate:"0"}) ;
            }
            //查看试题内容
            $scope.mangerExercise= function(id){
                $state.go('app.examination.exerciseShow',{paperId:id});
            };
            //批量删除
            $scope.btnDelete = function(){

            }
            //刷新
            $scope.btnRefresh = function(){
                tableList.refresh();
            }
            //重置
            $scope.btnReset = function(){
            }
        }]);

//试题更新、添加controller
app.controller('paperUpdateCtrl',
    ['$scope','$state', '$stateParams','paperService','Authentication','examinationCategoryService','exerciseService',
        function($scope,$state,$stateParams,paperService,Authentication,examinationCategoryService,exerciseService){
            var userId = Authentication.userId;
            $scope.paper = $stateParams.data == null?{}:$stateParams.data;
            var isUpdate = $scope.isUpdate = $stateParams.isUpdate == null?"1":$stateParams.isUpdate;
            if(isUpdate == "1"){
                $scope.titleContent = "更新试卷";
            }else{
                $scope.titleContent = "添加试卷";
            }
            var tableList = null;
            var exerciseMap = {};
            var addSelectIds = [];
            var selectIds = [];
            var selectExers = $scope.selectExers = [];
            $scope.selectExersLength =selectExers.length;
            var cateMap = {};
            //获取所有分类
            var catePromise = examinationCategoryService.getAllCategory()
            catePromise.then(function(msg){
                var data = msg['data'];
                for (let i = 0; i < data.length; i++) {
                    var obj = data[i];
                    cateMap[obj['_id']] = obj;
                }
            });
            //点击了选择题之后，弹出框，选择题目
            $scope.showExcExer = function(){
                tableList = new ExerciseForExamTableList($scope,{"tittle":""});
                tableList.init(addSelectIds);
                tableList.initEvents();
                exerciseMap= tableList.exerciseMap;
                selectIds = tableList.selectIds;
                $("#excExerModal").modal('show');
            }
            $scope.deleteSel =function(index){
                var obj = $scope.selectExers[index];
                var id = obj['_id'];
                var i = addSelectIds.indexOf(id);
                addSelectIds.splice(i,1);
                $scope.selectExers.splice(index,1)
                $scope.selectExersLength = $scope.selectExers.length;
            }
            $("#excExerModal").on("hidden.bs.modal",()=>{
                let allScore = 0;
                let length = selectExers.length;
                for (let i = 0; i < length; i++) {
                    let obj = selectExers[i];
                    allScore += obj['weight'];
                }
                $scope.$apply(function(){
                    $scope.paper.sumScore = allScore;
                });
            })
            $("#incExerModal").on("hidden.bs.modal",()=>{
                let allScore = 0;
                let length = selectExers.length;
                for (let i = 0; i < length; i++) {
                    let obj = selectExers[i];
                    allScore += obj['weight'];
                }
                $scope.$apply(function(){
                    $scope.paper.sumScore = allScore;
                });
            })
            if(isUpdate == "1"){
                var exercisePro = exerciseService.getExersByPaperId($scope.paper['_id'])
                exercisePro.then(function(msg){
                    var data = msg['data'];
                    for (let i = 0; i < data.length; i++) {
                        var exercise = data[i]['exerciseId'];
                        var categoryId = exercise['categoryId'];
                        exercise['categoryId'] = cateMap[categoryId];
                        selectExers.push(exercise);
                        addSelectIds.push(exercise['_id']);
                    }
                    $scope.selectExersLength = selectExers.length;
                });
            }
            //点击弹框保存 保存已经选择的数据
            $scope.saveSelectExer = function(){
                for (let i = 0; i < selectIds.length; i++) {
                    let exercieId = selectIds[i];
                    selectExers.push(exerciseMap[exercieId]);
                }
                $scope.selectExersLength =selectExers.length;
                $("#excExerModal").modal('hide');
            }
            $scope.showIncExer = function(){
                $("#incExerModal").modal('show');
            }
            $scope.saveIncExer = function(){
                $("#incExerModal").modal('hide');
            }
            //更新
            $scope.update = function(){
                var promise = paperService.updatePaper($scope.paper._id,$scope.paper,selectExers);
                promise.then(function(data){
                    var code = data['code'];
                    if(code == "0x0000"){
                        myVr_alert("修改成功",function(){
                            $state.go('app.examination.paperList');
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
                $scope.paper.userId=userId;
                var promise = paperService.addPaper($scope.paper,selectExers);
                promise.then(function(msg){
                    if(msg['code'] == '0x0000'){
                        myVr_alert("添加成功",function(){
                            $state.go('app.examination.paperList');
                        },function(){
                            console.log("点击了取消");
                        })
                    }else{
                        myVr_text_error("添加失败",msg['message'],function(){
                            $state.go('app.examination.paperList');
                        },function(){
                            console.log("点击了取消");
                        })
                    }
                })
            }
            $scope.back = function(){
                $state.go('app.examination.paperList');
            }
        }]);

//试卷信息查看
app.controller('showPaperExerCtrl',
    ['$scope','$compile','$state', '$stateParams','onlineExaminationService',
        function($scope,$compile,$state,$stateParams,onlineExaminationService){
            var paperId = $stateParams.paperId ;
            var paperInfoPromise = onlineExaminationService.getPaperInfo(paperId);
            paperInfoPromise.then(function(data){
                //判断是否为空
                $scope.paperInfo = data;
            });
            $scope.back = function(){
                $state.go('app.examination.paperList');
            }
    }])
