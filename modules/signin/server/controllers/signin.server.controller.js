var mongoose = require('mongoose'),
    Signin = mongoose.model('Signin');
/*//获取所有考试
exports.list = function (req, res) {
    var reqParam = req.query;
    delete reqParam._;
    console.log(reqParam);
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
    Examination.find(queryParam,{}).skip(offset).limit(limit).exec(function(err, examinations){
        if (err) {
            return res.status(422).send({
                message: "查询失败"
            });
        } else {
            var total = 0;
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
    console.log("moviemoviemovie");
    console.log(req);
    console.log(req.body);
    console.log("moviemoviemovie");
    var movieParam = req.body;
    Examination.save(function (err) {
        if (err) {
            return res.status(422).send({
                message: "更新成功"
            });
        } else {
            res.json(article);
        }
    });
};
//更新
exports.update = function(req,res){
    Examination.findOne({_id: req.params.examinationId}, function (err, examination) {
        if (err) {
            return res.send(err);
        }
        //把新值复制到新的上面
        for (prop in req.body) {
            examination[prop] = req.body[prop];
        }
        examination.save(function (err) {
            if (err) {
                return res.json({code:500,message:err});
            }
            res.json({code:200,message: "update a examination"});
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


module.exports.getByUserId = function(req,res){
    console.log("userIduserIdUSerId");
    var userId = req.query.userId;
    console.log(userId);
    console.log("userIduserIdUSerId");
    Signin.findOne({userId:userId}).exec(function(err,data){
        if(err){
            return res.status(422).json({code:'0x0001',message:"查询失败",data:null});
        }
        return res.status(200).json({code:'0x0000',message:'查询成功',data:data});
    });
}


module.exports.save = function(req,res){
    var signin = new Signin(req.body);
    console.log(signin);
    signin.save(function(err,data){
        if(err){
            return res.status(422).json({code:'0x0001',message:"添加失败",data:err});
        }
        return res.status(200).json({"code":"0x0000",message:"添加成功",data:data});
    });
}

module.exports.update = function(req,res){
    console.log("userusereximation");
    console.log(req.body);
    console.log(req.query.id);
    console.log("userIduserIdUSerId");
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
    console.log("userusereximation");
    console.log(req.body);
    console.log(req.query.id);
    console.log("userIduserIdUSerId");
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


