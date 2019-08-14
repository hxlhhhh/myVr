var mongoose = require('mongoose'),
    Paper = mongoose.model('Paper'),
    PaperExercise = mongoose.model('PaperExercise');
//添加一个试卷
exports.save = function (req, res) {
    var body = req.body;
    var paperParam = body['paper'];
    var exercises = body['exercises'];
    var paramObj = new Paper(paperParam);
    //1 保存试卷
    paramObj.save(function (err,paper) {
        if (err) {
            return res.status(422).json({
                code:"0x0001",
                message: "添加失败",
                data:null
            });
        } else {
            var objs = [];
            var paperId = paper['_id'];
            for (let i = 0; i < exercises.length; i++) {
                var exerciseId = exercises[i];
                objs.push({paperId:paperId,exerciseId:exerciseId});
            }
            //2 添加新的关联关系
            if(objs.length > 0){
                PaperExercise.insertMany(objs,function(err,data){
                    if(err){
                        return res.status(422).json({code:"0x0001",message:err});
                    }

                });
            }
            return res.status(200).json({code:"0x0000",message: "添加成功",data:null});
        }
    });
};
//试卷更新
exports.update = function(req,res){
    var body = req.body;
    var paperParam = body['paper'];
    var exercises = body['exercises'];
    Paper.findOne({_id: req.query.paperId}, function (err, paper) {
        if (err) {
            return res.send(err);
        }
        //把新值复制到新的上面
        for (prop in paperParam) {
            paper[prop] = paperParam[prop];
        }
        //1 保存试卷
        paper.save(function (err,data) {
            if (err) {
                return res.status(422).json({code:"0x0001",message:err});
            }
            var paperId = data['_id'];
            var objs = [];
            for (let i = 0; i < exercises.length; i++) {
                var exerciseId = exercises[i];
                objs.push({paperId:paperId,exerciseId:exerciseId});
            }
            if(objs.length > 0){
                //2 删除原始关联关系
                PaperExercise.remove({paperId:paperId},function(){
                    if(err){
                        return res.status(422).json({code:"0x0001",message:err});
                    }
                    //3 添加新的关联关系
                    PaperExercise.insertMany(objs,function(err,data){
                        if(err){
                            return res.status(422).json({code:"0x0001",message:err});
                        }
                        return res.status(200).json({code:"0x0000",message: "update a paper success",data:null});
                    });
                });
            }else{
                return res.status(200).json({code:"0x0000",message: "update a examination",data:null});
            }
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
    var sort = reqParam['sort'];
    if(sort == undefined){
        sort = '_id';
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
    Paper.find(queryParam,{}).populate('userId').sort(o).skip(offset).limit(limit).exec(function(err, papers){
        if (err) {
            return res.status(422).json({
                code:"0x0001",
                message: "查询失败",
                data:null,
            });
        } else {
            var total = 0;
            Paper.find(queryParam,{}).exec(function(err,countPaper){
                //判断为空
                total = countPaper.length;
                var data = {
                    "total":total,
                    "data":papers,
                    "limit":limit,
                    "offset":offset
                }
                var msg = {
                    "code":'0x0000',
                    "msg":'查询成功',
                    'data':data
                }
                res.status(200).json(msg);
            });

        }
    });
};

//根据id查询
exports.getPaperById = function (req, res) {
    var paperId = req.query.paperId;
    Paper.findOne({_id:paperId}, function (err, paper) {
        if (err) {
            return res.status(422).json({code:'0x0001',message:err,data:null});
        }
        res.status(200).json(
            {
                code:'0x0000',
                data: paper,
                message:"查询成功"
            }
        );
    });
};
//根据id删除
exports.deleteById = function (req, res) {
    var paperId = req.query.paperId;
    //bixuzuode
    //1 先判断考试=-试卷表中有无数据
    //2 删除关系表
    PaperExercise.remove({paperId:paperId}).exec(function(err,data){
        if(err){
            return res.status(422).json({code:'0x0001',message:err,data:null});
        }
    //3 删除数据
        Paper.remove({"_id":paperId}).exec(function(err,data){
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
    });
};
//获取所有试卷
exports.getAll = function (req, res) {
    Paper.find({}, function (err, paper) {
        if (err) {
            return res.status(422).json({code:'0x0001',message:err,data:null});
        }
        res.status(200).json(
            {
                code:'0x0000',
                data: paper,
                message:"查询成功"
            }
        );
    });
};


