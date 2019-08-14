var mongoose = require('mongoose'),
    Notice = mongoose.model('Notice')
//获取所有考试
exports.list = function (req, res) {
    var reqParam = req.query;
    delete reqParam._;
    var queryParam = {};
    var offset = parseInt(reqParam['offset']);
    delete reqParam.offset;
    var limit = parseInt(reqParam['limit']);
    delete reqParam.limit;
    for (prop in reqParam) {
        var value = reqParam[prop];
        if( value != null && value.trim() != '' ){
            queryParam[prop] = new RegExp(value) ;
        }
    }
    Notice.find(queryParam,{}).populate('owner').skip(offset).limit(limit).exec(function(err, notices){
        if (err) {
            return res.status(422).send({
                message: "查询失败"
            });
        } else {
            var total = 0;

            Notice.find(queryParam,{}).exec(function(err,countNotices){

                //判断为空
                total = countNotices.length;
                var data = {
                    "total":total,
                    "data":notices,
                    "limit":limit,
                    "offset":offset
                }
                var msg = {
                    "code":200,
                    "msg":'查询成功',
                    'data':data
                }

                res.json(msg);
            });
        }
    });
};
//添加
exports.save = function (req, res) {
    var noticeParam = req.body;
    var notice = new Notice(noticeParam);
    notice.save(function (err,notice) {
        if (err) {
            return res.status(422).json({
                code:"0x0001",
                message: "添加失败",
                data:null});
        } else {
            return res.status(200).json({
                code:"0x0000",
                message: "添加成功",
                data:notice
            });
        }
    });
};
//按页查询
exports.getByPage = function (req, res) {
    var reqParam = req.query;
    delete reqParam._;
    var queryParam = {};
    var offset = parseInt(reqParam['offset']);
    delete reqParam.offset;
    var limit = parseInt(reqParam['limit']);
    delete reqParam.limit;
    var sort = reqParam['sort'];
    if(sort == undefined){
        sort = "_id";
    }
    delete reqParam.sort;
    var order = reqParam['order'];
    delete reqParam.order;
    let orderMode = 1;//默认升序
    if(order == "asc"){
        orderMode = 1;
    }else{
        orderMode = -1;
    }
    var o ={};
    o[sort] = orderMode;

    for (prop in reqParam) {
        var value = reqParam[prop];
        if( value != null && value.trim() != '' ){
            queryParam[prop] = new RegExp(value) ;
        }
    }
    Notice.find(queryParam,{}).sort(o).populate('owner').skip(offset).limit(limit).exec(function(err, notices){
        if (err) {
            return res.status(422).send({
                code:'0x0001',
                message: "查询失败",
                data:null
            });
        } else {
            var total = 0;
            Notice.find(queryParam,{}).exec(function(err,countNotices){

                //判断为空
                total = countNotices.length;
                var data = {
                    "total":total,
                    "data":notices,
                    "limit":limit,
                    "offset":offset
                }
                var msg = {
                    "code":"0x0000",
                    "msg":'查询成功',
                    'data':data
                }
                res.status(200).json(msg);
            });
        }
    });
};
//更新
exports.update = function(req,res){
    let bodyParam = req.body;
    let noticeId = req.query.noticeId;
    Notice.findOne({_id: noticeId}, function (err, notice) {
        if (err) {
            return res.send(err);
        }
        //把新值复制到新的上面
        for (prop in bodyParam) {
            notice[prop] = bodyParam[prop];
        }
        notice.save(function (err,data) {
            if (err) {
                return res.json({code:500,message:err});
            }
            return res.json({code:200,message: "update a notice"});
        });
    });
}
//获取一个notice
exports.getById = function(req,res){
    let noticeId = req.query.noticeId;
    Notice.findOne({_id: noticeId}, function (err, notice) {
        if (err) {
            return res.status(422).json({code:"0x0001",message:err})
        }
        return res.status(200).json({
                code:'0x0000',
                data: notice,
                message:"查询成功"
            });
    });
}
//删除 根据id
exports.deleteById = function(req,res){
    Notice.remove({_id:req.query.noticeId},function(err){
        if(err){
            return res.status(422).json({code:"0x0001",message:err});
        }else{
            return res.status(200).json({
                    code:'0x0000',
                    data: null,
                    message:"删除成功"
                });
        }
    })
}
//批量删除
exports.batchDel = function(req,res){
    let param = req.body;
    let idList = param['idList'];
    Notice.remove({_id:{$in:idList}},function(err,data){
        if(err){
            return res.status(500).json({code:"0x0001",message:"删除失败"});
        }
        return res.status(200).json({code:"0x0000",message:"删除成功"});
    })

}


