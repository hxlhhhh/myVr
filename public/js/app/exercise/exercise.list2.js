var ExerciseForExamTableList = function($scope,params) {
    var table = new Object();
    var tableData = {};
    var that = table;
    that.params = {"limit":3,"offset":0}
    $scope.options=new Array();
    $scope.events=new Array();
    table.selectIds = [];
    var addedList = [];
    table.exerciseMap = {},//id-->exercise
    table.init = function (ids) {
        addedList = ids;
        $("#table").bootstrapTable('destroy');
        $('#table').bootstrapTable({
            url: '/api/exercises/getExcByPage',        //请求后台的URL(*)
            method: 'post',                                      //请求方式(*)
            toolbar:'toolBar',
            striped: true,                                      //是否显示行间隔色
            cache: false,                                       //是否使用缓存,默认为true,所以一般情况下需要设置一下这个属性(*)
            pagination: true,                                   //是否显示分页(*)
            sortable: false,                                    //是否启用排序
            sortOrder: "asc",                                   //排序方式
            queryParams: that.queryParam,                    //传递参数(*)
            responseHandler: responseHandler2,            //对返回结果进行格式转换,符合Bootstrap Table需求
            sidePagination: "server",                           //分页方式:client客户端分页,server服务端分页(*)
            pageNumber: 1,                                       //初始化加载第一页,默认第一页
            pageSize: 6,                                       //每页的记录行数(*)
            pageList: [3, 6, 9],                             //可供选择的每页的行数(*)
            //search: true,                                     //是否显示表格搜索,此搜索是客户端搜索,不会进服务端,所以,个人感觉意义不大
            strictSearch: true,
            showColumns: false,                                  //是否显示所有的列
            showRefresh: false,                                  //是否显示刷新按钮
            minimumCountColumns: 2,                             //最少允许的列数
            clickToSelect: true,                                //是否启用点击选中行
            // height: 712,                                        //行高,如果没有设置height属性,表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                                     //每一行的唯一标识,一般为主键列
            showToggle: false,                                   //是否显示详细视图和列表视图的切换按钮
            cardView: false,                                    //是否显示详细视图
            detailView: false,                                  //是否显示父子表
            showFooter: false,                                  //是否显示页脚
            columns: [
                {
                    checkbox: true,
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'tittle',
                    title: '题目名称',
                    align: 'center',
                    width:'300px'
                },{
                    field: 'weight',
                    title: '分值',
                    align: 'center',
                },{
                    field: 'type',
                    title: '类型',
                    align: 'center',
                    formatter:function(value,row,index){
                        var valueContent = "";
                        if(value == "0"){
                            valueContent = "选择题";
                        }
                        return valueContent;
                    }
                },{
                    field: 'categoryId',
                    title: '所属分类',
                    align: 'center',
                    formatter:function(value,row,index){
                        return value['name'];
                    }
                }]
        });
        function responseHandler2(msg){
            var result ={};
            var map = table.exerciseMap;
            var code = msg['code'];
            if(code == "0x0000"){
                var data = msg['data']
                result['total'] = data['total'];
                var list = data['data'];
                for (let i = 0; i < list.length; i++) {
                    console.log(list[i]);
                    var obj = list[i];
                    map[obj['_id']] = obj;
                }
                result['rows'] = list;
                result['limit'] = data['limit'];
                result['offset'] = data['offset'];
            }
            tableData = result
            // result['limit'] = 5;
            return result;
        };
    }

    table.queryParam = function(reqParam){
        var inputParams = reqParam;
        if (inputParams == null) {
            inputParams = that.params;
        }
        var resParams = {
            offset: inputParams.offset,     //页码
            limit: inputParams.limit,       //页面大小
        };
        resParams['tittle'] = params['tittle'];
        resParams['excIdList'] = addedList;
        return resParams;
    }

    table.refresh = function(selectOpt){
        var $table = $("#table")
        if(selectOpt != "" && selectOpt != null){
            if(tableData['rows'].length <= 1 || selectOpt == tableData['rows'].length){
                //判断当前是第几页
                var pageNumber = $table.bootstrapTable('getOptions').pageNumber;
                if(pageNumber != 1){
                    $table.bootstrapTable('prevPage');
                }else{
                    $table.bootstrapTable('refresh',that.queryParams);
                }
            }else{
                $table.bootstrapTable('refresh',that.queryParams);
            }
        }else {
            $table.bootstrapTable('refresh', that.queryParams);
        }

    }

    table.btnDelete = function(){
    }

    table.initEvents = function(){
        //添加table中一行触发事件操作数组
        var union = function (array, ids) {
            $.each(ids, function (i, id) {
                if ($.inArray(id, array) == -1) {
                    array[array.length] = id;
                }
            });
            return array;
        };
        //取消table中一行触发事件操作数组
        var difference = function (array, ids) {
            $.each(ids, function (i, id) {
                var index = $.inArray(id, array);
                if (index != -1) {
                    array.splice(index, 1);
                }
            });
            return array;
        };
        var _ = {"union": union, "difference": difference};
        //绑定选中事件、取消事件、全部选中、全部取消             最终得到的数据
        $('#table').on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table', function (e, rows,sourceRows) {
            var eType = e.type;
            if(eType == 'uncheck-all'){
                rows = sourceRows;
            }
            var ids = $.map(!$.isArray(rows) ? [rows] : rows, function (row) {
                return row._id;
            });
            var func = $.inArray(eType, ['check', 'check-all']) > -1 ? 'union' : 'difference';
            table.selectIds = _[func](table.selectIds, ids);
        });
    }
    return table;
}
