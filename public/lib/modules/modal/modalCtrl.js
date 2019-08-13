

app.factory('modalController', function($scope, $rootScope, $uibModal ) {
    var data = "更新成功";
    $scope.openModal = function() {
        var modalInstance = $uibModal.open({
            templateUrl : '/tpl/modal/index.html',//script标签中定义的id
            controller : 'modalCtrl',//modal对应的Controller
            resolve : {
                data : function() {//data作为modal的controller传入的参数
                    return data;//用于传递数据
                }
            }
        })
    }
})
//模态框对应的Controller
app.factory('modalCtrl',function( $uibModalInstance, data){
    return {
        ok:function(){
            $uibModalInstance.close();
        },
        cancel:function(){
            $uibModalInstance.dismiss();
        }
    }
})

