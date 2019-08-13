var mongoose = require('mongoose'),
    UserExamination = mongoose.model('UserExamination');


module.exports.getExaminationByUserId = function(req,res){
    var userId = req.query.userId;
    UserExamination.find({userId:userId}).populate('userId examinationId').exec(function(err,data){
        if(err){
            return res.status(422).json(err);
        }
        return res.json(data);
    });
}


module.exports.save = function(req,res){
    var userExamination = new UserExamination(req.body);
    userExamination.save(function(err,data){
        if(err){
            return res.status(422).json(err);
        }
            return res.json({"code":200,"message":"添加成功"});
    });
}

module.exports.update = function(req,res){
    UserExamination.findOne({_id:req.query.id},function(err,userExamination){
        if (err) {
            return res.send(err);
        }
        //把新值复制到新的上面
        for (prop in req.body) {
            userExamination[prop] = req.body[prop];
        }
        userExamination.save(function (err) {
            if (err) {
                return res.json({code:500,message:err});
            }
            res.json({code:200,message: "update success"});
        });
    })

}

//预约考试
module.exports.updateIsOrder = function(req,res){
    UserExamination.findOne({_id:req.query.id},function(err,userExamination){
        if (err) {
            return res.send(err);
        }
        //把新值复制到新的上面
        for (prop in req.body) {
            userExamination[prop] = req.body[prop];
        }
        userExamination.save(function (err) {
            if (err) {
                return res.status(422).json({code:"0x0001",message:err,data:null});
            }
            res.status(200).json({code:"0x0000",message: "修改成功",data:null});
        });
    })
}

//分页+模糊查询数据
module.exports.getByPage = function(req,res){
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
    //zhushi
    queryParam = {};
    UserExamination.find(queryParam,{}).populate('userId examinationId').skip(offset).limit(limit).exec(function(err, userExams){
        if (err) {
            return res.status(422).json({
                code:"0x0001",
                message: "查询失败",
                data:null,
            });
        } else {
            var total = 0;
            UserExamination.find(queryParam,{}).exec(function(err,countUserExam){
                //判断为空
                total = countUserExam.length;
                var data = {
                    "total":total,
                    "data":userExams,
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
}


//发布考试
module.exports.insertMany = function(req,res){
    var reqBody = req.body;
    UserExamination.insertMany(reqBody,function(err,data){
        if(err){
            return res.status(422).json({code:'0x0001',message:'批量添加失败',data:null});
        }else{
            return res.status(200).json({code:'0x0000',message:'批量添加成功',data:null});
        }
    });
}

//删除
module.exports.deleteById = function(req,res){
    var id = req.query.id;
    UserExamination.remove({_id:id},function(err,data){
        if(err){
            return res.status(422).json({code:'0x0001',message:'删除失败',data:null});
        }else{
            return res.status(200).json({code:'0x0000',message:'删除成功',data:null});
        }
    });
}


//删除
module.exports.batchDel = function(req,res){
    var idList = req.body['idList'];
    UserExamination.remove({_id:{$in:idList}},function(err,data){
        if(err){
            return res.status(422).json({code:'0x0001',message:err,data:null});
        }else{
            return res.status(200).json({code:'0x0000',message:'删除成功',data:null});
        }
    });
}

module.exports.getByExaminationId = function(req,res){
    var examinationId = req.query.examinationId;
    UserExamination.find({examinationId:examinationId}).populate('userId').exec(function(err,data){
        if(err){
            return res.status(422).json({code:'0x0001',message:'查询失败',data:null});
        }else{
            return res.status(200).json({code:'0x0000',message:'查询成功',data:data});
        }
    });
}
