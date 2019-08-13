//试题列表controller
app.controller('exerciseCtrl',
    ['$scope','$compile','$state', '$stateParams','exerciseService',
        function($scope,$compile,$state,$stateParams,exerciseService){
            $scope.exercise = {
                "tittle":""
            };
            $scope.isAdd = "1";
            $scope.tittleText = "添加分类";
            $scope.usCategory = {};
            var params = $scope.exercise;
            var tableList = new ExerciseTableList($scope,$compile,params);
            tableList.init();
            tableList.initEvents();
            $scope.blurFun=function(){
                tableList.refresh();
            }
            //编辑
            $scope.edit = function(id){
                var promise = exerciseService.getExerciseById(id);
                promise.then(function(data){
                    console.log("aaa");
                    console.log(data);
                    console.log("aaa");
                    if(data['code'] == '0x0000'){
                        $state.go('app.examination.exerciseUpdate',{data:data['data'],isUpdate:"1"}) ;
                    }else{
                        //查询失败 zhushiluxh
                    }
                });
            };
            //删除
            $scope.delete = function(id){
                var promise = exerciseService.delExerciseById(id);
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
                    var pro = exerciseService.batchDel({idList:idList});
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
                console.log("点击了重置按钮");
            }
        }]);

//试题更新controller
app.controller('exerciseUpdateCtrl',
    ['$scope','$compile','$state', '$stateParams','exerciseService','examinationCategoryService',
        function($scope,$compile,$state,$stateParams,exerciseService,examinationCategoryService){
            var alpArray = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'];
            var exercise = $scope.exercise = $stateParams.data == null?{}:$stateParams.data;
            var options = exercise['options'];
            options = exercise['options'] = options == undefined?[]:options;
            $scope.conf = [];
            if(options.length > 0){
                for (let i = 0; i < options.length; i++) {
                    if(options[i]['isRightAnswer'] == "0"){
                        console.log("kkk");
                        $scope.conf[0] = i +"";
                        break;
                    }
                }
            }
            $scope.categories = [];
            $scope.category = {};
            var categoryPro = examinationCategoryService.getAllCategory();
            categoryPro.then(function(msg){
                if(msg['code'] == '0x0000'){
                    var category = $scope.exercise['categoryId'];
                    var categoryId = null;
                    if(category != undefined){
                        categoryId = category['_id'];
                    }
                    var defaultCategory = {};
                    $scope.categories = msg['data'];
                    for (let i = 0; i < $scope.categories.length; i++) {
                        var obj = $scope.categories[i];
                        if(i == 1){
                            defaultCategory = obj;
                        }
                        if(obj['_id'] == categoryId){
                            defaultCategory = obj;
                            break;
                        }
                    }
                    $scope.category = defaultCategory;
                }else{
                }
            })
            $scope.isUpdate = $stateParams.isUpdate;

            if($scope.isUpdate == "1"){
                $scope.titleText = "更新习题";
            }else{
                $scope.titleText = "添加习题";
            }
            $scope.usCategory = {};
            //更新
            $scope.update = function(){
                if($scope.conf.length == 0){
                    return ;
                }else{
                    var index = parseInt($scope.conf[0]);
                    exercise.options[index]['isRightAnswer'] = '0';
                }
                exercise['categoryId'] = $scope.category['_id'];
                var promise = exerciseService.updateExercise(exercise['_id'],exercise);
                promise.then(data =>{
                  console.log(data);
                  if(data['code'] == '0x0000'){
                      myVr_alert('更新成功',function(){
                          $state.go("app.examination.exerciseList");
                      },function(){})
                  }
                });
            }
            //添加
            $scope.add = function(){
                if($scope.conf.length == 0){
                    return ;
                }else{
                    var index = parseInt($scope.conf[0]);
                    exercise.options[index]['isRightAnswer'] = '0';
                }
                exercise['categoryId'] = $scope.category['_id'];
                var promise = exerciseService.addExercise(exercise);
                promise.then(data =>{
                  console.log(data);
                  if(data['code'] == '0x0000'){


                      myVr_alert('添加成功',function(){
                          $state.go("app.examination.exerciseList");
                      },function(){})
                  }
                });
            }
            //添加一个选项
            $scope.addOption = function(){
                var length = options.length;
                console.log(length);
                if(length >= alpArray.length){
                    console.log("每题最多"+length+"个选项");
                }else{
                    var option = {
                        content: "",
                        exerciseId: "",
                        isRightAnswer: "1",
                        name: alpArray[length]
                    }
                    options.push(option);
                }

            }
            //删除一个选项
            $scope.delOption = function(index){
                var selected = -1;
                if( $scope.conf.length> 0){
                    selected = parseInt($scope.conf[0]);
                }
                if(selected == index){
                    $scope.conf.splice(0,1);
                }
                options.splice(index,1);
                maintainIndex(options,index);
            }
            function maintainIndex(options,index){
                for (let i = index ; i < options.length; i++) {
                    var obj = options[i];
                    obj.name = alpArray[i];
                }
            }
        }]);
