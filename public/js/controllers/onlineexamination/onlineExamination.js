app.controller('onlineExaminationCtrl',
    ['$scope','$state', '$stateParams','$location', '$anchorScroll','onlineExaminationService','$interval','examinationUserService','$window',
    function($scope,$state,$stateParams,$location,$anchorScroll,onlineExaminationService,$interval,examinationUserService,$window){
        let count = 5;
        console.log("加载了在线考试controller");
        console.log("paramparam");
        var examination = $stateParams.data;
        console.log(examination);
        console.log("paramparam");
        $scope.examination =examination;
        let duration = $scope.examination['duration'];
        var examinationInfoPromise = onlineExaminationService.getExaminationInfo(examination['_id']);
        examinationInfoPromise.then(function(data){
            //判断是否为空
            $scope.examinationInfo = data;
            console.log(data)
        });
        //滚动条
        $scope.showQsn = function(qsnId){
            $location.hash('qst_'+qsnId);
            $anchorScroll();
        }
        //选择
        $scope.chooseRadio=function(indexQst){
            console.log("点击");
            console.log(indexQst);
            var $qst = $("#qst_"+indexQst);
            var isMarkUp = $qst.attr('data-markup');
            console.log(isMarkUp);
            if(isMarkUp == "0"){
                $("#indexQst_"+indexQst).css("backgroundColor","#4DA6FF");
            }
            $qst.attr('data-did',"1");
            console.log("点击");
        };
        //标记
        $scope.markup=function(indexQst){
            var $qst = $("#qst_"+indexQst);
            var isDid = $qst.attr('data-did');
            var isMarkUp = $qst.attr('data-markup');
            if(isMarkUp == "1"){
                if(isDid == "1"){
                    $("#indexQst_"+indexQst).css("backgroundColor","#4DA6FF");
                }else{
                    $("#indexQst_"+indexQst).css("backgroundColor","#FFFFFF");
                }
                $qst.attr('data-markup',"0");
            }else{
                $("#indexQst_"+indexQst).css("backgroundColor","#FF9326");
                $qst.attr('data-markup',"1");
            }

        }
        $scope.conf = [];
        var allScore = 0;

        //倒计时
        var allTime = duration * 60;
        $scope.countDown = duration+"分钟";
        var timer = $interval(function () {
            if(allTime >= 0){
                $scope.countDown = timeFormatter(allTime);
                allTime-- ;
            }else{
                $interval.cancel(timer);
                var allScore = 0;
                for (var i = 0; i <  $scope.examinationInfo.length; i++) {
                    var obj =  $scope.examinationInfo[i];
                    var selectID = $scope.conf[i];
                    var exercise = obj['exercise'];
                    var weight = exercise['weight'];
                    var rightOpt = obj['rightOpt']['_id'];
                    if(rightOpt == selectID){
                        allScore += weight;
                    }
                }
                myVr_text_alert_confirm("提交成功","您的总分是:"+ allScore,
                    function(){
                        var id = $scope.examination['relId'];
                        var obj = {
                            "score":allScore,
                            "status":"3"
                        }
                        var promise = updateUserExam(id,obj);
                        promise.then(function(){
                            console.log("更新成功");
                            allScore = 0;
                            $state.go('app.examination.myExams');
                        })
                    })
            }
        }, 1000);


        //提交
        $scope.submitExam =function(){
            var notSelect = "";
            for (var i = 0; i <  $scope.examinationInfo.length; i++) {
                var obj =  $scope.examinationInfo[i];
                var selectID = $scope.conf[i];
                console.log(selectID);
                if(selectID == undefined){
                    notSelect += i+1 +"、"
                }
                var exercise = obj['exercise'];
                var weight = exercise['weight'];
                var rightOpt = obj['rightOpt']['_id'];
                if(rightOpt == selectID){
                    allScore += weight;
                }
            }
            if(notSelect.length>0){
                myVr_text_warn("提示","您的"+ notSelect.substr(0,notSelect.length-1)+"未做，是否提交？",
                    function(){
                        //禁止弹框
                        count = 0;
                        $interval.cancel(timer);
                        myVr_text_alert_confirm("提交成功","您的总分是:"+ allScore,
                            function(){
                                var id = $scope.examination['relId'];
                                var obj = {
                                    "score":allScore,
                                    "status":"3"
                                }
                                var promise = updateUserExam(id,obj);
                                promise.then(function(){
                                    console.log("更新成功");
                                    allScore = 0;
                                    $state.go('app.examination.myExams');
                                })
                            })
                    },function(){
                        return ;
                    })
            }else{
                swal({
                    title: "提示",
                    text:"您的题目已经做完，是否提交？",
                    buttons: {
                        cancel: "取消",
                        confirm: "确定"
                    }
                }).then(function (isConfirm) {
                    if(!isConfirm) {
                        return;
                    }else{
                        //禁止弹框
                        count = 0;
                        $interval.cancel(timer);
                        myVr_text_alert_confirm("提交成功","您的总分是:"+ allScore,
                            function(){
                                var id = $scope.examination['relId'];
                                var obj = {
                                    "score":allScore,
                                    "status":"3"
                                }
                                var promise = updateUserExam(id,obj);
                                promise.then(function(){
                                    console.log("更新成功");
                                    allScore = 0;
                                    $state.go('app.examination.myExams');
                                })
                            })
                }})
            }
        }
        function timeFormatter(second){
            var minutes = Math.floor(second / 60);
            var secs = second % 60;
            return minutes + "分钟" + secs + "秒"
        }
        function updateUserExam(id,obj){
            var promise = examinationUserService.updateUserExamination(id,obj);
            return promise;
        }

        function submitExamToDb(){
            count = -1;
            $interval.cancel(timer);
            var id = $scope.examination['relId'];
            var obj = {
                "score":allScore,
                "status":"3"
            }
            allScore = 0;
            var promise = updateUserExam(id,obj);
            promise.then(function(){

                myVr_text_alert_confirm("您的试卷已经提交成功","您的总分是:"+ allScore,
                    function(){
                     $state.go('app.examination.myExams');
                 })

            })
        }

        //禁止切换
        $window.onblur = function(){
            count = count - 1;
            if(count == 0){
                submitExamToDb();
            }else if(count >= 1 ){
                myVr_text_warn_confirm("特别注意","切换"+ count +"次后将自动交卷",function(){
                    return false;
                })
            }
        };
        //屏蔽右键
        document.oncontextmenu =function(){
            event.returnValue=false;
        }
        document.onkeydown = function() {
            var k = $window.event.keyCode;
            if (k == 123) {//f12
                window.event.keyCode = 0;
                window.event.returnValue = false;
            }
            if (k == 116) { //f5
                $window.event.keyCode = 0;
                $window.event.returnValue = false;
            }
            if ($window.event.ctrlKey && k == 82) {//ctrl+R
                $window.event.keyCode = 0;
                event.returnValue = false;
            }
            if(window.event.altKey   &&
                (k   ==   37   || //屏蔽 Alt+方向键
                    k   ==   39)){ //屏蔽 Alt+ 方向键
                console.log("111111");
                $window.event.keyCode = 0;
                event.returnValue=false;
            }
        }
}]);
