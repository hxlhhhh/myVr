var mongoose = require('mongoose'),
    Examination = mongoose.model('Examination'),
    ExaminationPaper = mongoose.model('ExaminationPaper'),
    UserExamination = mongoose.model('UserExamination');
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
    Examination.find(queryParam,{}).populate('userId').skip(offset).limit(limit).exec(function(err, examinations){
        if (err) {
            return res.status(422).send({
                message: "查询失败"
            });
        } else {
            var total = 0;
            //todo zhushi 用户的所有信息全部返回了
            Examination.find(queryParam,{}).exec(function(err,countExaminations){

                //判断为空
                total = countExaminations.length;
                var data = {
                    "total":total,
                    "data":examinations,
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
//添加一个试卷
exports.save = function (req, res) {
    console.log("tianjia tianjiatianjiatianjia ");
    var body = req.body;
    var examinationParam = body['examination'];
    var paperIds = body['paperIds'];
    console.log(examinationParam);
    console.log(paperIds);
    console.log("tianjiatianjiatianjia");
    var examination = new Examination(examinationParam);
    //1 保存试卷
    examination.save(function (err,examination) {
        if (err) {
            return res.status(422).json({
                code:"0x0001",
                message: "添加失败",
                data:null
            });
        } else {
            var objs = [];
            var examinationId = examination['_id'];
            for (let i = 0; i < paperIds.length; i++) {
                var paperId = paperIds[i];
                objs.push({examinationId:examinationId,paperId:paperId});
            }
            //2 添加新的关联关系
            if(objs.length > 0){
                ExaminationPaper.insertMany(objs,function(err,data){
                    if(err){
                        return res.status(422).json({code:"0x0001",message:err});
                    }

                });
            }
            return res.status(200).json({code:"0x0000",message: "添加一场考试",data:null});
        }
    });
};
//更新
exports.update = function(req,res){
    var examinationId = req.query.examinationId;
    var body = req.body;
    var exam = body['examination'];
    var paperIds = body['paperIds'];
    var userIds = body['userIds'];
    console.log(examinationId);
    console.log(exam);
    console.log(paperIds);
    console.log(userIds);
    Examination.findOne({_id: examinationId}, function (err, examination) {
        console.log(examination);
        if (err) {
            return res.status(422).json({code:"0x0001",message:err,data:null});
        }
        //把新值复制到新的上面
        for (prop in exam) {
            examination[prop] = exam[prop];
        }
        //1 保存试卷
        examination.save(function (err,data) {
            if (err) {
                return res.status(422).json({code:"0x0001",message:err});
            }
            var examinationId = data['_id'];
            var objs = [];
            for (let i = 0; i < paperIds.length; i++) {
                var paperId = paperIds[i];
                objs.push({examinationId:examinationId,paperId:paperId});
            }
            //if(objs.length > 0){
            //2 删除原始关联关系
            ExaminationPaper.remove({examinationId:examinationId},function(){
                if(err){
                    return res.status(422).json({code:"0x0000",message:err});
                }
                //3 添加新的关联关系
                ExaminationPaper.insertMany(objs,function(err,data){
                    if(err){
                        return res.status(422).json({code:"0x0001",message:err});
                    }
                    //4 维持用户-与考试的关系
                    UserExamination.remove({examinationId:examinationId},function(err,data){
                        if(err)
                            return res.status(422).json({code:"0x0001",message:err});
                        var ues = [];
                        for (let i = 0; i < userIds.length; i++) {
                            ues.push({examinationId:examinationId,userId:userIds[i],status:"0",score:0});
                        }
                        UserExamination.insertMany(ues,function(err,data){
                            if(err){
                                return res.status(422).json({code:"0x0001",message:err});
                            }
                            return res.status(200).json({code:"0x0000",message: "update a examination",data:null});
                        });
                    });
                });
            });
            //}else{
              //  return res.status(200).json({code:"0x0000",message: "update a examination",data:null});
            //}



        });
    });
}
//获取一个examination
exports.getById = function(req,res){
    var result = {};
    var examinationId = req.query.examinationId;
    Examination.findOne({_id: examinationId}, function (err, examination) {
        if (err) {
            return res.send(err);
        }
        result['examination'] = examination;
        var paperIds = [];
        ExaminationPaper.find({examinationId:examinationId})
            .exec(function(err,data){
                if(err){
                    return res.status(422).json({code:"0x0001",message:err,data:null});
                }
                for (let i = 0; i < data.length; i++) {
                    var obj = data[i];
                    paperIds.push(obj['paperId']);
                }
                result['paperIds'] = paperIds;
                return res.status(200).json({
                    code:'0x0000',
                    message:"查询成功",
                    data: result
                });
            });
    });
}

//获取所有考试
exports.getAllExam = function(req,res){
    Examination.find({}, function (err, examinations) {
        console.log(err);
        console.log(examinations);
        if (err) {
            return res.status(422).json({code:"0x0001",message:err,data:null});
        }
        return res.status(200).json({
            code: '0x0000',
            message:"查询成功",
            data: examinations
        });

    });
}

//删除 根据id
exports.deleteById = function(req,res){
    //是否删除userExamination中的数据 zhushi
    var examinationId = req.params.examinationId;
    ExaminationPaper.remove({examinationId:examinationId},function(err,data){
        if(err)
            return res.status(422).json({code:'0x0001',message:"删除数据失败"});
        //删除用户考试关系表数据
        UserExamination.remove({examinationId:examinationId},function(){
            if(err)
                return res.status(422).json({code:'0x0001',message:"删除数据失败"});
            Examination.remove({_id:examinationId},function(err){
                if(err){
                    return res.send(err);
                }else{
                    return res.status(200).json(
                        {
                            code:'0x000',
                            data: null,
                            message:"删除成功"
                        }
                    );
                }
            })
        });

    });
}
//批量删除
exports.batchDel = function(req,res){
    var body = req.body;
    var idList = body['idList'];
    ExaminationPaper.remove({ _id: { $in: idList}},function(err,data){
        if(err){
            return res.status(422).json({code:"0x0001",message:err,data:null});
        }else{
            UserExamination.remove({examinationId:{$in:idList}},function(){
                if(err)
                    return res.status(422).json({code:'0x0001',message:"删除数据失败"});
                Examination.remove({ _id: { $in: idList}},function(err,data){
                    if(err){
                        return res.status(422).json({code:"0x0001",message:err,data:null});
                    }else{
                        res.json({
                                code:'0x0000',
                                data: null,
                                message:"删除成功"
                            }
                        );
                    }
                })
            });
        }
    });
}


