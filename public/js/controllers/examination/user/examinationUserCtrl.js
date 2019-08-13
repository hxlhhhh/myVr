app.controller('examinationUserCtrl',
    ['$scope','$state', '$stateParams','examinationUserService','Authentication','signinService','$location','userService',
        function($scope,$state,$stateParams,examinationUserService,Authentication,signinService,$location,userService){
            var userId = Authentication.userId;
            $scope.isSignin = "0";
            $scope.user = {};
            getMyExaminationInfo($scope);
            //签到
            signinService.getByUserId(userId).then(function(msg){
                var signin = msg['data'];
                if(signin != null){
                    $scope.isSignin = "1";
                }
            })
            var userPromise = userService.getUserById(userId);
            userPromise.then(function(msg){
                if(msg['code'] == '0x0000'){
                    console.log(msg)
                    $scope.user = msg['data'];

                }
            });
            //预约
            $scope.orderExam = function(examination){
                var promise = examinationUserService.orderExamination(examination.relId,{status:"1"})
                promise.then(function(data){
                    if(data['code'] == '0x0000'){
                        swal({
                            title: "预约成功",
                            buttons: {
                                confirm: "确定"
                            }}).then(function(isConfirm){
                                if(isConfirm){
                                    console.log("点击了确定");
                                }
                            })
                         }
                })
                console.log("預約");
            }
            //取消预约
            $scope.cannelOrderExam = function(examination){
                var promise = examinationUserService.orderExamination(examination.relId,{status:"0"})
                promise.then(function(data){
                    if(data['code'] == '0x0000'){
                        swal({
                            title: "取消预约成功",
                            buttons: {
                                confirm: "确定"
                            }}).then(function(isConfirm){
                                if(isConfirm){
                                    getMyExaminationInfo($scope);
                                }
                            })
                         }
                })
            }
            $scope.startExam =function(obj){
                var curDateMil = new Date().getTime();
                var startDate = new Date(obj['startDate']);
                var startDateMil = new Date(startDate).getTime();
                var endDate = new Date(obj['endDate']);
                var endDateMil = new Date(endDate).getTime();
                if(curDateMil < startDateMil){
                    swal({
                        title: "还不可以开始考试",
                        buttons: {
                            cancel: "取消",
                            confirm: "确定"
                        }
                    }).then(function(isConfirm){
                        if(isConfirm){
                            console.log("点击了确定");
                        }else{
                            console.log("点击了取消");
                        }
                    })
                }
                if(curDateMil > endDateMil){
                    swal({
                        title: "考试时间已过",
                        buttons: {
                            cancel: "取消",
                            confirm: "确定"
                        }
                    }).then(function(isConfirm){
                        if(isConfirm){
                            console.log("点击了确定");
                        }else{
                            console.log("点击了取消");
                        }
                    })
                }

                if(curDateMil >= startDateMil && curDateMil <= endDateMil){
                    swal({
                        title: "可以进行考试",
                        text:"考试开始时间:"+obj['startDate'],
                        buttons: {
                            cancel: "取消",
                            confirm: "确定"
                        }
                    }).then(function(isConfirm){
                        if(isConfirm){
                            $state.go("online.examination",{data: obj});
                        }else{
                            console.log("点击了取消");
                        }
                    })
                }


            }
            $scope.userSignin = function(){
                var signinIp = $location.host();
                var promise = signinService.signin({userId:userId,signinIp:signinIp})
                promise.then(function(data){
                    $scope.isSignin = "1";
                })
            }
            function dateFormate(date){
                var srcDate = new Date(date);
                var fmt = "yyyy-MM-dd hh:mm:ss";
                var o = {
                    "M+" : srcDate.getMonth()+1,     //月份
                    "d+" : srcDate.getDate(),     //日
                    "h+" : srcDate.getHours(),     //小时
                    "m+" : srcDate.getMinutes(),     //分
                    "s+" : srcDate.getSeconds(),     //秒
                    "q+" : Math.floor((srcDate.getMonth()+3)/3), //季度
                    "S" : srcDate.getMilliseconds()    //毫秒
                };
                if(/(y+)/.test(fmt))
                    fmt=fmt.replace(RegExp.$1, (srcDate.getFullYear()+"").substr(4 - RegExp.$1.length));
                for(var k in o)
                    if(new RegExp("("+ k +")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                return fmt;
            }
            function getMyExaminationInfo($scope){
                var examinationsUserPromise = examinationUserService.getExaminationsByUserId(userId);
                examinationsUserPromise.then(function(examinations){
                    $scope.isOrderExaminations = [];
                    $scope.isDoneExaminations = [];
                    for (let i = 0; i < examinations.length; i++) {
                        var orderLength = $scope.isOrderExaminations.length;
                        var doneLength = $scope.isDoneExaminations.length;
                        if( orderLength >= 5 && doneLength >= 5){
                            break;
                        }
                        var obj = examinations[i];
                        obj['startDate'] = dateFormate(obj['startDate']);
                        obj['endDate'] = dateFormate(obj['endDate']);
                        obj['creatDate'] = dateFormate(obj['creatDate']);
                        var status = obj['status'];
                        if(status == "1" ){
                            if(orderLength < 5){
                                $scope.isOrderExaminations.push(obj);
                            }
                        }else if(status == "3"){
                            if(doneLength < 5) {
                                $scope.isDoneExaminations.push(obj);
                            }
                        }
                    }
                });
            }
    }]);

//考生成绩
app.controller('examinationUserMyScoreCtrl',
    ['$scope','$state', '$stateParams','examinationUserService','Authentication',
    function($scope,$state,$stateParams,examinationUserService,Authentication){
        $scope.isDoneExaminations = [];
        $scope.notDoneExaminations = [];
        var userId = Authentication.userId;
        var examinationsUserPromise = examinationUserService.getExaminationsByUserId(userId);
        examinationsUserPromise.then(function(examinations){
            for (let i = 0; i < examinations.length; i++) {
                var obj = examinations[i];
                obj['startDate'] = dateFormate(obj['startDate']);
                obj['endDate'] = dateFormate(obj['endDate']);
                obj['creatDate'] = dateFormate(obj['creatDate']);
                var status = obj['status'];
                if(status == "3"){
                    $scope.isDoneExaminations.push(obj);
                }else if(status == "2"){
                    $scope.notDoneExaminations.push(obj);
                }
            }
        });
        $scope.startExam =function(obj){
            var curDateMil = new Date().getTime();
            var startDate = new Date(obj['startDate']);
            var startDateMil = new Date(startDate).getTime();
            var endDate = new Date(obj['endDate']);
            var endDateMil = new Date(endDate).getTime();
            if(curDateMil < startDateMil){
                swal({
                    title: "还不可以开始考试",
                    buttons: {
                        cancel: "取消",
                        confirm: "确定"
                    }
                }).then(function(isConfirm){
                    if(isConfirm){
                        console.log("点击了确定");
                    }else{
                        console.log("点击了取消");
                    }
                })
            }
            if(curDateMil > endDateMil){
                swal({
                    title: "考试时间已过",
                    buttons: {
                        cancel: "取消",
                        confirm: "确定"
                    }
                }).then(function(isConfirm){
                    if(isConfirm){
                        console.log("点击了确定");
                    }else{
                        console.log("点击了取消");
                    }
                })
            }

            if(curDateMil >= startDateMil && curDateMil <= endDateMil){
                swal({
                    title: "可以进行考试",
                    text:"考试开始时间:"+obj['startDate'],
                    buttons: {
                        cancel: "取消",
                        confirm: "确定"
                    }
                }).then(function(isConfirm){
                    if(isConfirm){
                        $state.go("online.examination",{data: obj});
                    }else{
                        console.log("点击了取消");
                    }
                })
            }


        }
        function dateFormate(date){
            var srcDate = new Date(date);
            var fmt = "yyyy-MM-dd hh:mm:ss";
            var o = {
                "M+" : srcDate.getMonth()+1,     //月份
                "d+" : srcDate.getDate(),     //日
                "h+" : srcDate.getHours(),     //小时
                "m+" : srcDate.getMinutes(),     //分
                "s+" : srcDate.getSeconds(),     //秒
                "q+" : Math.floor((srcDate.getMonth()+3)/3), //季度
                "S" : srcDate.getMilliseconds()    //毫秒
            };
            if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (srcDate.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+ k +")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return fmt;
        }
    }]);



//考生预约
app.controller('examinationUserMyOrderCtrl',
    ['$scope','$state', '$stateParams','examinationUserService','Authentication',
        function($scope,$state,$stateParams,examinationUserService,Authentication){
            getMyExaminationInfo($scope)
            //预约
            $scope.orderExam = function(examination){
                var promise = examinationUserService.orderExamination(examination.relId,{status:"1"})
                promise.then(function(data){
                    if(data['code'] == '0x0000'){
                        swal({
                            title: "预约成功",
                            buttons: {
                                confirm: "确定"
                            }}).then(function(isConfirm){
                                if(isConfirm){
                                    getMyExaminationInfo($scope)
                                }
                        })
                    }
                })
            }
            //取消预约
            $scope.cannelOrderExam = function(examination){
                var promise = examinationUserService.orderExamination(examination.relId,{status:"0"})
                promise.then(function(data){
                    if(data['code'] == '0x0000'){
                        swal({
                            title: "取消预约成功",
                            buttons: {
                                confirm: "确定"
                            }}).then(function(isConfirm){
                                if(isConfirm){
                                    getMyExaminationInfo($scope)
                                }
                        })
                    }
                })
            }
            $scope.startExam =function(obj){
                var curDateMil = new Date().getTime();
                var startDate = new Date(obj['startDate']);
                var startDateMil = new Date(startDate).getTime();
                var endDate = new Date(obj['endDate']);
                var endDateMil = new Date(endDate).getTime();
                if(curDateMil < startDateMil){
                    swal({
                        title: "还不可以开始考试",
                        buttons: {
                            cancel: "取消",
                            confirm: "确定"
                        }
                    }).then(function(isConfirm){
                        if(isConfirm){
                            console.log("点击了确定");
                        }else{
                            console.log("点击了取消");
                        }
                    })
                }
                if(curDateMil > endDateMil){
                    swal({
                        title: "考试时间已过",
                        buttons: {
                            cancel: "取消",
                            confirm: "确定"
                        }
                    }).then(function(isConfirm){
                        if(isConfirm){
                            console.log("点击了确定");
                        }else{
                            console.log("点击了取消");
                        }
                    })
                }

                if(curDateMil >= startDateMil && curDateMil <= endDateMil){
                    swal({
                        title: "可以进行考试",
                        text:"考试开始时间:"+obj['startDate'],
                        buttons: {
                            cancel: "取消",
                            confirm: "确定"
                        }
                    }).then(function(isConfirm){
                        if(isConfirm){
                            $state.go("online.examination",{data: obj});
                        }else{
                            console.log("点击了取消");
                        }
                    })
                }


            }
            function dateFormate(date){
                var srcDate = new Date(date);
                var fmt = "yyyy-MM-dd hh:mm:ss";
                var o = {
                    "M+" : srcDate.getMonth()+1,     //月份
                    "d+" : srcDate.getDate(),     //日
                    "h+" : srcDate.getHours(),     //小时
                    "m+" : srcDate.getMinutes(),     //分
                    "s+" : srcDate.getSeconds(),     //秒
                    "q+" : Math.floor((srcDate.getMonth()+3)/3), //季度
                    "S" : srcDate.getMilliseconds()    //毫秒
                };
                if(/(y+)/.test(fmt))
                    fmt=fmt.replace(RegExp.$1, (srcDate.getFullYear()+"").substr(4 - RegExp.$1.length));
                for(var k in o)
                    if(new RegExp("("+ k +")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                return fmt;
            }
            //获取考试信息
            function getMyExaminationInfo($scope){
                var userId = Authentication.userId;
                var examinationsUserPromise = examinationUserService.getExaminationsByUserId(userId);
                examinationsUserPromise.then(function(examinations){
                    $scope.isOrderExaminations = [];
                    $scope.notOrderExaminations = [];
                    for (let i = 0; i < examinations.length; i++) {
                        var obj = examinations[i];
                        obj['startDate'] = dateFormate(obj['startDate']);
                        obj['endDate'] = dateFormate(obj['endDate']);
                        obj['creatDate'] = dateFormate(obj['creatDate']);
                        var status = obj['status'];
                        if(status == "1" ){
                            $scope.isOrderExaminations.push(obj);
                        }else if(status == 0){
                            $scope.notOrderExaminations.push(obj);
                        }
                    }
                });
            }
        }]);
