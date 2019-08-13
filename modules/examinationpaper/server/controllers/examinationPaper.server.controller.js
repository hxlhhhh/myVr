var mongoose = require('mongoose');
/*//获取所有考试
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
    var exercises = body['exercises'];
    console.log(examinationParam);
    console.log(exercises);
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
            for (let i = 0; i < exercises.length; i++) {
                var exerciseId = exercises[i];
                objs.push({examinationId:examinationId,exerciseId:exerciseId});
            }
            //2 添加新的关联关系
            if(objs.length > 0){
                ExaminationExercise.insertMany(objs,function(err,data){
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
    var body = req.body;
    var exam = body['examination'];
    var exercises = body['exercises'];
    Examination.findOne({_id: req.params.examinationId}, function (err, examination) {
        if (err) {
            return res.send(err);
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
            for (let i = 0; i < exercises.length; i++) {
                var exerciseId = exercises[i];
                objs.push({examinationId:examinationId,exerciseId:exerciseId});
            }
            if(objs.length > 0){
                //2 删除原始关联关系
                ExaminationExercise.remove({examinationId:examinationId},function(){
                    if(err){
                        return res.status(422).json({code:"0x0000",message:err});
                    }
                    //3 添加新的关联关系
                    ExaminationExercise.insertMany(objs,function(err,data){
                        if(err){
                            return res.status(422).json({code:"0x0001",message:err});
                        }
                        return res.status(200).json({code:"0x0000",message: "update a examination",data:null});
                    });
                });
            }else{
                return res.status(200).json({code:"0x0000",message: "update a examination",data:null});
            }
        });
    });
}
//获取一个examination
exports.getById = function(req,res){
    Examination.findOne({_id: req.params.examinationId}, function (err, examination) {
        if (err) {
            return res.send(err);
        }
        console.log("fffffffffffffffffffffff");
        console.log(examination.toJSON());
        console.log("fffffffffffffffffffffff");
        res.json(
            {
                code:'200',
                data: examination.toJSON()}
            );
    });
}

//删除 根据id
exports.deleteById = function(req,res){
    console.log("dddddddddddddddddddddddddddddddd");
    console.log(req.params.examinationId);
    console.log("dddddddddddddddddddddddddddddddd");
    Examination.remove({_id:req.params.examinationId},function(err){
        if(err){
            return res.send(err);
        }else{
            res.json(
                {
                    code:'200',
                    data: "删除成功"
                }
            );
        }
    })
}*/


