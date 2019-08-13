var mongoose = require('mongoose'),
    Paper = mongoose.model('Paper'),
    PaperExercise = mongoose.model('PaperExercise'),
    Depart = mongoose.model('Depart'),
    User = mongoose.model('User');
//添加一个部门
exports.save = function (req, res) {
    var body = req.body;
    var paramObj = new Depart(body);
    paramObj.save(function (err,paper) {
        if (err) {
            return res.status(422).json({
                code:"0x0001",
                message: "添加失败",
                data:null
            });
        } else {
            return res.status(200).json({code:"0x0000",message: "添加成功",data:null});
        }
    });
};
//试卷更新
exports.update = function(req,res){
    var bodyParam = req.body;
    var departId = req.query.departId;
    Depart.findOne({_id: departId}, function (err, depart) {
        if (err) {
            return res.send(err);
        }
        //把新值复制到新的上面
        for (prop in bodyParam) {
            depart[prop] = bodyParam[prop];
        }
        depart.save(function (err,data) {
            if (err) {
                return res.status(422).json({code:"0x0001",message:err});
            }
            return res.status(200).json({code:"0x0000",message: "update a depart",data:null});
        });
    });
}
//分页查询
exports.getByPage = function (req, res) {
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
    Depart.find(queryParam,{}).skip(offset).limit(limit).exec(function(err, depart){
        if (err) {
            return res.status(422).json({
                code:"0x0001",
                message: "查询失败",
                data:null,
            });
        } else {
            var total = 0;
            Depart.find(queryParam,{}).exec(function(err,countDepart){
                //判断为空
                total = countDepart.length;
                var data = {
                    "total":total,
                    "data":depart,
                    "limit":limit,
                    "offset":offset
                }
                var msg = {
                    "code":'0x0000',
                    "msg":'查询成功',
                    'data':data
                }
                return res.status(200).json(msg);
            });
        }
    });
};
//根据id查询
exports.getById = function (req, res) {
    var departId = req.query.departId;
    Depart.findOne({_id:departId}, function (err, depart) {
        if (err) {
            return res.status(422).json({code:'0x0001',message:err,data:null});
        }
        res.status(200).json(
            {
                code:'0x0000',
                data: depart,
                message:"查询成功"
            }
        );
    });
};

//根据id删除
exports.deleteById = function (req, res) {
    var departId = req.query.departId;
    //1 先判断用户是否关联
    //2 删除关系表
    User.find({departId:departId}).exec(function(err,data){
        if(err){
            return res.status(422).json({code:'0x0001',message:err,data:null});
        }
        if(data.length > 0){
            return res.status(200).json({code:'0x0001',message:"有引用，不可删除",data:null});
        }else{
            Depart.remove({"_id":departId}).exec(function(err,data){
                if(err){
                    return res.status(422).json({code:'0x0001',message:err,data:null});
                }else{
                    res.status(200).json({
                        code:'0x0000',
                        data: null,
                        message:"删除成功"
                    });
                }
            });
        }
    });
};
//批量删除
exports.batchDel = function (req, res) {
    var bodyParam = req.body;
    //1 先判断用户是否关联
    //2 删除关系表
    var idList = bodyParam['idList']
    User.find({departId:{$in:idList}}).exec(function(err,data){
        if(err){
            return res.status(422).json({code:'0x0001',message:err,data:null});
        }
        if(data.length > 0){
            return res.status(200).json({code:'0x0001',message:"有引用，不可删除",data:null});
        }else{
            Depart.remove({"_id":{$in:idList}}).exec(function(err,data){
                if(err){
                    return res.status(422).json({code:'0x0001',message:err,data:null});
                }else{
                    res.status(200).json({
                        code:'0x0000',
                        data: null,
                        message:"删除成功"
                    });
                }
            });
        }
    });
};

exports.getAll = function (req, res) {
    Depart.find({}, function (err, depart) {
        if (err) {
            return res.status(422).json({code:'0x0001',message:err,data:null});
        }
        res.status(200).json(
            {
                code:'0x0000',
                data: depart,
                message:"查询成功"
            }
        );
    });
};



