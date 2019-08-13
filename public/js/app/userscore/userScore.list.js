var UserScoreTableList = function($scope,$compile,params) {
    var table = new Object();
    var tableData = {};
    var that = table;
    that.params = {"limit":3,"offset":0}
    $scope.options=new Array();
    $scope.events=new Array();
    table.selectIds = [];
    table.init = function () {
        $("#table").bootstrapTable('destroy');
        $('#table').bootstrapTable({
            url: '/api/userExaminations/getByPage',        //请求后台的URL(*)
            method: 'get',                                      //请求方式(*)
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
                    field: 'examinationId',
                    title: '考试名称',
                    align: 'center',
                    formatter:function(value,row,index){
                        if(value != null)
                            return value['name'];
                        else{
                            return "考试不存在";
                        }
                    }
                },{
                    field: 'userId',
                    title: '学员姓名',
                    align: 'center',
                    formatter:function(value,row,index){
                        return value['userName'];
                    }
                },{
                    field: 'score',
                    title: '成绩/总成绩',
                    align: 'center',
                    formatter:function(value,row,index){
                        var valueContent = '-';
                        if(row['status'] == "3"){
                            var sumScore = "";
                            if(row['examinationId'] == undefined){
                                sumScore = "-";
                            }else{
                                sumScore = ['sumScore'];
                            }
                            valueContent = ""+value +"/"+sumScore
                        }
                        return valueContent;
                    }
                },{
                    field: 'status',
                    title: '状态',
                    align: 'center',
                    formatter:function(value,row,index){
                        var valueContent = '';
                        switch (value) {
                            case "0":
                                valueContent = "未预约";break;
                            case "1":
                                valueContent = "已预约";break;
                            case "2":
                                valueContent = "未考试";break;
                            case "3":
                                valueContent = "已考试";break;
                            default :
                                valueContent = '未知的状态';
                                break;
                        }
                        return valueContent;
                    }
                },{
                    field:"_id",
                    title:'操作',
                    formatter: function(value,row,index){
                        var rtn="<div id='option_"+row._id+"'></div>";//在格式化操作栏的过程中添加一个id唯一的空div，供后续编译使用
                        //event可依据当前记录创建不同的元素内容
                        var event=
                            "<button style='margin-right: 5px' class='btn btn-sm btn-danger' title='删除' ng-click='delete("+'"'+value+'"'+")'>" +
                            "<span class='glyphicon glyphicon-trash'>删除</span></button>" ;
                        $scope.options.push("option_"+row._id);//将id push至options数组
                        $scope.events.push(event);//将待创建的htmlpush到events数组"
                        return rtn;
                    }
                }],
            onLoadSuccess:function(){//调用bootstrap加载完成方法
                for(var i=0;i < $scope.options.length;i++){//通过循环所创建的数据，将元素逐个进行compile
                    var _option = $scope.options[i];
                    var _event = $scope.events[i];
                    var $el=$(_event).appendTo("#"+_option);
                    $compile($el)($scope);//compile完成后，页面即可响应ng事件
                }
                //置空数据
                $scope.options = [];
                $scope.events = [];
            }
        });
        function responseHandler2(msg){
            var result ={};
            var code = msg['code'];
            if(code == "0x0000"){
                var data = msg['data']
                result['total'] = data['total'];
                result['rows'] = data['data'];
                result['limit'] = data['limit'];
                result['offset'] = data['offset'];
            }
            tableData = result
            // result['limit'] = 5;
            return result;
        };
    }

    table.queryParam = function(reqParam){
        console.log("reqparmreqparam");
        console.log(reqParam);
        console.log("reqparmreqparam");
        var inputParams = reqParam;
        if (inputParams == null) {
            inputParams = that.params;
        }
        var resParams = {
            offset: inputParams.offset,     //页码
            limit: inputParams.limit,       //页面大小
        };

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

    table.resetIds = function(){
        table.selectIds = [];
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
