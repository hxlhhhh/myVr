app.controller('examinationCtrl',
    ['$scope','$compile','$state', '$stateParams','examinationService','userService','userExaminationService',
    function($scope,$compile,$state,$stateParams,examinationService,userService,userExaminationService){
    $scope.examination = {
        "name":"",
        "subject":""
    };
    var params = $scope.examination;
    var tableList = new examTableList($scope,$compile,params);
    tableList.init();
    tableList.initEvents();
    $scope.blurFun=function(){
        tableList.refresh();
    }
    //编辑
    $scope.edit = function(id){
        var promise = examinationService.getExaminationById(id);
        promise.then(function(obj){
            $state.go('app.examination.update',{data:obj.data,isUpdate:1});
        });
    };
    //查看试题内容
    $scope.mangerExercise= function(id){
        $state.go('app.examination.exerciseShow',{examinationId:id});
    };
    //删除
    $scope.delete = function(id){
        var promise = examinationService.delExaminationById(id);
        promise.then(function(obj){
            tableList.refresh(1);
        });
    }
    $scope.publishExam = function(examinationId){
        var getUserPromise = userService.getUserByRoles("user")
        getUserPromise.then(function(msg){
            console.log(msg);
            var users = msg['data'];
            var userExams = [];
            for (let i = 0; i < users.length; i++) {
                var user = users[i]
                var userId = user['_id']
                userExams.push({userId:userId,examinationId:examinationId,status:"0"});
            }
            console.log(userExams);
            if(userExams.length > 0){
                var addPromise = userExaminationService.addManyObj(userExams);
                addPromise.then(function(msg){
                    if(msg['code'] == '0x0000'){
                        myVr_alert("发布成功");
                    }
                });
            }
        })
    }
    //添加
    $scope.btnAdd = function(){
        $state.go('app.examination.update',{data:null,isUpdate:0,});
    }
    $scope.btnDelete = function(){
        var idList = tableList.selectIds;
        if(idList.length == 0){
            myVr_warn("请选择删除的数据",function(){
                return;
            });
        }else{
            var pro = examinationService.batchDel({idList:idList});
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
//更新试卷
app.controller('examinationUpdateCtrl',
    ['$scope','$compile','$state', '$stateParams','examinationService','Authentication','examinationCategoryService','paperService','userService','userExaminationService',
     function($scope,$compile,$state,$stateParams,examinationService,Authentication,examinationCategoryService,paperService,userService,userExaminationService){
         var userId = Authentication.userId;
         $scope.paper = [];
         $scope.examination = {};
         var paperIds = [];
         var $userExerModal = $("#userExerModal");
         var addedUserIds = [];
         var tableList = new UserForExamTableList($scope,$compile,{userName:"",phone:""});
         //点击添加用户时，弹出框
         $scope.btnAddUser = function(){
             tableList.init(addedUserIds);
             tableList.initEvents();
             $userExerModal.modal('show');
         }
         $scope.saveSelectUser = function(){
             var userMap = tableList.userMap;
             var selectIds = tableList.selectIds;
             var selectLength = selectIds.length;
             for (let i = 0; i < selectLength; i++) {
                 var selectId = selectIds[i];
                 addedUserIds.push(selectId);
                 $scope.selectUsers.push(userMap[selectId]);
             }
         }
         $scope.selectUsers = [];
         //删除选择的用户
         $scope.deleteSelectUser = function(index){
             var user = $scope.selectUsers[index];
             var i = addedUserIds.indexOf(user['_id']);
             addedUserIds.splice(i,1);
             $scope.selectUsers.splice(index,1);
         }
         if($stateParams.data != undefined){
             $scope.examination = $stateParams.data['examination'];
             var uEPromise = userExaminationService.getByExaminationId($scope.examination['_id'])
             uEPromise.then(function(msg){
                 var data = msg['data'];
                 var length = data.length;
                 if(length > 0){
                     for (let i = 0; i < length; i++) {
                         var obj = data[i]['userId'];
                         $scope.selectUsers.push(obj);
                         addedUserIds.push(obj['_id']);
                     }
                 }
             });
             paperIds = $stateParams.data['paperIds'];
             $scope.examination.startDate = new Date($scope.examination['startDate']);
             $scope.examination.endDate= new Date($scope.examination['endDate']);
         }else{
             $scope.examination = {};
             $scope.examination.startDate = new Date();
             $scope.examination.endDate= new Date();
         }
         $scope.isUpdate = $stateParams.isUpdate;
         var paperMap = {};
         //获取所有试卷
         var paperPromise = paperService.getAll();
         paperPromise.then(function(data){
             var defaultPaper = {};
             if(data['code'] == '0x0000'){
                 var paper = data['data'];
                 for (let i = 0; i < paper.length; i++) {
                     var obj = paper[i];
                     if(i == 0){defaultPaper = obj;}
                     paperMap[obj['_id']] = obj;
                 }

                 $scope.paper = paper;
             }
             //默认就一张试卷
             if(paperIds.length >= 1){
                 $scope.selectPaper = paperMap[paperIds[0]];
             }else{
                 $scope.selectPaper = defaultPaper;
             }
         });
         $scope.openStartDate = function($event) {
             $event.preventDefault();
             $event.stopPropagation();
             $scope.openStrat = true;
         };
         $scope.openEndDate = function($event) {
             $event.preventDefault();
             $event.stopPropagation();
             $scope.openEnd = true;
         };
         $scope.startDateOptions = {
             maxDate:new Date(),
             formatYear: 'yy',
             startingDay: 1,
             class: 'datepicker'
         };
         $scope.endDateOptions = {
             minDate:new Date(),
             formatYear: 'yy',
             startingDay: 1,
             class: 'datepicker'
         };
         $scope.format = 'yyyy-MM-dd hh:mm:ss';
         $scope.$watch('examination.startDate',function(newValue,oldValue){
             $scope.endDateOptions.minDate = newValue;
         });
         $scope.$watch('examination.endDate',function(newValue,oldValue){
             $scope.startDateOptions.maxDate = newValue;
         });
         $scope.update = function(){
             var paperIds = [$scope.selectPaper['_id']];
             var userIds = addedUserIds;
             var promise = examinationService.updateExamination($scope.examination._id,$scope.examination,paperIds,userIds);
             promise.then(function(data){
                 var code = data['code'];
                 if(code == "0x0000"){
                     myVr_alert("修改成功",function(){
                         $state.go('app.examination.list');
                     },function(){
                         console.log("点击了取消");
                     })
                 }else{

                 }
             }).catch(function(data){
                 myVr_error("修改失败",function(){
                     $state.go('app.examination.list');
                 },function(){
                     console.log("点击了取消");
                 })
             });
         }
         //添加
         $scope.add = function(){
             var paperIds = [$scope.selectPaper['_id']];
             //zhushi
             $scope.examination.userId=userId;
             var promise = examinationService.addExamination($scope.examination,paperIds);
             promise.then(function(msg){
                 if(msg['code'] == '0x0000'){
                     myVr_alert("添加成功",function(){
                         $state.go('app.examination.list');
                     },function(){
                         console.log("点击了取消");
                     })
                 }else{
                     myVr_text_error("添加失败",msg['message'],function(){
                         $state.go('app.examination.list');
                     },function(){
                         console.log("点击了取消");
                     })
                 }
             })
         }
        //当考试-试卷多对多时，进行处理
/*
        var tableList = null;
        var exerciseMap = {};
        var selectIds = [];
        var selectExers = $scope.selectExers = [];
        $scope.selectExersLength =selectExers.length;
        $scope.isUpdate = $stateParams.isUpdate;
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
             tableList = new ExerciseForExamTableList($scope,$compile,{"tittle":""});
             tableList.init();
             tableList.initEvents();
             exerciseMap= tableList.exerciseMap;
             selectIds = tableList.selectIds;
             $("#excExerModal").modal('show');
        }
        if($scope.isUpdate == "1"){
            var exercisePro = exerciseService.getExersByExaminationId($scope.examination['_id'])
            exercisePro.then(function(msg){
                var data = msg['data'];
                for (let i = 0; i < data.length; i++) {
                    var exercise = data[i]['exerciseId'];
                    var categoryId = exercise['categoryId'];
                    exercise['categoryId'] = cateMap[categoryId];
                    selectExers.push(exercise);
                }
                $scope.selectExersLength = selectExers.length;
            });
        }
        $scope.selectExercise = [];
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
            var promise = examinationService.updateExamination($scope.examination._id,$scope.examination,selectExers);
            promise.then(function(data){
                var code = data['code'];
                if(code == "0x0000"){
                    myVr_alert("修改成功",function(){
                        $state.go('app.examination.list');
                    },function(){
                        console.log("点击了取消");
                    })
                }else{

                }
            }).catch(function(data){
                myVr_error("修改失败",function(){
                    $state.go('app.examination.list');
                },function(){
                    console.log("点击了取消");
                })
            });
        }
        //添加
        $scope.add = function(){
            console.log($scope.examination);
            //添加用户id
            //zhushi
            $scope.examination.userId=userId;
            var promise = examinationService.addExamination($scope.examination,selectExers);
            promise.then(function(msg){
                console.log(msg);
                if(msg['code'] == '0x0000'){

                    myVr_alert("添加成功",function(){
                        $state.go('app.examination.list');
                    },function(){
                        console.log("点击了取消");
                    })
                }else{
                    myVr_text_error("添加失败",msg['message'],function(){
                        $state.go('app.examination.list');
                    },function(){
                        console.log("点击了取消");
                    })
                }
            })
        }
*/
        $scope.back = function(){
            $state.go('app.examination.list');
        }
    }]);
//jiangyaofeiqi
app.controller('showExaminationExerCtrl',
    ['$scope','$compile','$state', '$stateParams','onlineExaminationService',
    function($scope,$compile,$state,$stateParams,onlineExaminationService){
        var examinationId = $stateParams.examinationId ;
        var examinationInfoPromise = onlineExaminationService.getExaminationInfo(examinationId);
        examinationInfoPromise.then(function(data){
            //判断是否为空
            $scope.examinationInfo = data;
        });
        $scope.back = function(){
            $state.go('app.examination.list');
        }
    }])
