var mongoose = require('mongoose'),
    UserGroupMenu = mongoose.model('UserGroupMenu');
//获取所有考试
/*exports.getByExaminationId = function(req,res){

}*/
//分页+模糊查询
/*exports.getByPage = function (req, res) {
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
    UserGroup.find(queryParam,{}).skip(offset).limit(limit).exec(function(err, userGroups){
        if (err) {
            return res.status(422).json({
                code:"0x0001",
                message: "查询失败",
                data:null,
            });
        } else {
            var total = 0;
            UserGroup.find(queryParam,{}).exec(function(err,countUserGroups){
                //判断为空
                total = countUserGroups.length;
                var data = {
                    "total":total,
                    "data":userGroups,
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
};*/

/*exports.getExcByPage = function (req, res) {
    var reqParam = req.body;
    var queryParam = {};
    var offset = parseInt(reqParam['offset']);
    delete reqParam.offset;
    var limit = parseInt(reqParam['limit']);
    delete reqParam.limit;
    var excIdList = reqParam['excIdList'];
    delete reqParam.excIdList;
    for (prop in reqParam) {
        var value = reqParam[prop];
        if( value != null && value.trim() != '' ){
            queryParam[prop] = new RegExp(value) ;
        }
    }
    if(excIdList.length > 0){
        queryParam['_id'] = {$nin:excIdList};
    }
    Exercise.find(queryParam,{}).populate('categoryId').skip(offset).limit(limit).exec(function(err, exercises){
        if (err) {
            return res.status(422).json({
                code:"0x0001",
                message: "查询失败",
                data:null,
            });
        } else {
            var total = 0;
            Exercise.find(queryParam,{}).exec(function(err,countExercise){
                //判断为空
                total = countExercise.length;
                var data = {
                    "total":total,
                    "data":exercises,
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

exports.getExerciseById = function (req, res) {
    var reqParam = req.query;
    var exerciseId = reqParam['exerciseId']
    Exercise.findOne({'_id':exerciseId},{}).populate('categoryId').exec(function(err, exercise){
        if (err) {
            return res.status(200).json({
                code:"0x0001",
                message: "查询失败",
                data:null,
            });
        }
        var result = {};
        result['type'] = exercise['type'];
        result['_id'] = exercise['_id'];
        result['categoryId'] = exercise['categoryId'];
        result['weight'] = exercise['weight'];
        result['tittle'] = exercise['tittle'];
        ExerciseOption.find({exerciseId:exerciseId}).exec(function(err,options){
            if(err){

            }else{
                result['options'] = options
            }
            console.log(result);
            return res.status(200).json({
                code:'0x0000',
                message:'查询成功',
                data:result
            });
        })
    });
};

exports.deleteById = function(req,res) {
    var exerciseId = req.query.exerciseId;
    //1 查看是否被试卷引用
    PaperExercise.find({exerciseId: exerciseId}, function (err,data) {
        if (err) {
            return res.status(422).json({
                code: '0x0001',
                message: err,
                data: null,
            });
        }
        if (data.length > 0) {
            return res.status(200).json({
                code: '0x0001',
                message: "习题被引用",
                data:null
            });
        }
        //2 删除答案
        ExerciseOption.remove({exerciseId: exerciseId}, function (err) {
            if (err) {
                return res.status(422).json({
                    code:'0x0001',
                    message:'删除习题答案出错',
                    data:null,
                });
            }
            //删除数据
            Exercise.remove({_id: exerciseId}, function (err) {
                if (err) {
                    return res.status(422).json({
                        code: '0x0001',
                        message: '习题被引用',
                        data: err,
                    });
                } else {
                    return res.status(200).json({
                        code: '0x0000',
                        message: '删除成功',
                        data: null,
                    });
                }
            })
        })
    })
}

exports.addExercise = function (req, res) {
    var param = req.body;
    var options = param['options'];
    delete param.options;
    var exercise = new Exercise(param);
    exercise.save(function(err,data){
        if(err){
            return res.status(422).json({
                code:'0x0001',
                message:err,
                data:null
            });
        }
        for (let i = 0; i < options.length; i++) {
            var obj = options[i];
            obj['exerciseId'] = data['_id'];
        }
        ExerciseOption.insertMany(options).then(result =>{
            console.log(result);
            return res.status(200).json({
                code: '0x0000',
                message: '添加成功',
                data: null,
            });
        }).catch(result =>{
            return res.status(200).json({
                code: '0x0001',
                message: '添加失败',
                data: null,
            });
        });

    });
};

exports.updateExercise = function(req,res){
    var exerciseId = req.query.exerciseId;
    var param = req.body;
    var options = param['options'];
    delete param.options;
    console.log("parampamra");
    console.log(param);
    console.log("parampamra");
    Exercise.findOne({_id: exerciseId}, function (err, exercise) {
        if (err) {
            return res.send(err);
        }
        //把新值复制到新的上面
        for (prop in req.body) {
            exercise[prop] = param[prop];
        }
        exercise.save(function (err) {
            if (err) {
                return res.status(422).json({code:"0x0001",message:err,data:null});
            }
            //删除原始选项
            ExerciseOption.remove({exerciseId:exerciseId}).exec(function(err,data){
                if(err){
                    return res.status(422).json({code:"0x0001",message:err,data:null});
                }
                var os = [];
                for (let i = 0; i < options.length; i++) {
                    options[i]['exerciseId'] = exercise['_id'];
                }
                //添加新选项
                ExerciseOption.insertMany(options).then(result =>{
                    console.log(result);
                    return res.status(200).json({
                        code: '0x0000',
                        message: '更新成功',
                        data: null,
                    });
                }).catch(result =>{
                    return res.status(200).json({
                        code: '0x0001',
                        message: '更新失败',
                        data: null,
                    });
                });
            });

        });
    });
}*/

//批量删除
/*exports.batchDel = function(req,res){
    var param = req.body;
    var idList = param['idList'];
    //1 查看是否被试卷使用
    User.find({"userGroupId": {$in: idList}},function(err,data){
        if(err)
            return res.status(422).json({code:'0x0001',data:null,message:err});
        if(data.length > 0){
            return res.status(200).json({code:'0x00001',data:null,message:"用户正在被引用"});
        }else{
            //2 删除选项
            UserGroup.remove({"userGroupId":{$in:idList}},function(err,data){
                if(err)
                    return res.status(422).json({code:'0x0001',data:null,message:err});
                else
                    //3 删除数据
                    Exercise.remove({"_id":{$in:idList}},function(err,data){
                        if(err)
                            return res.status(422).json({code:'0x0001',data:null,message:err});
                        else
                            return res.status(200).json({code:'0x0000',data:null,message:err});
                    });
            })
        }
    });
}*/


exports.add = function (req, res) {
    var param = req.body;
    var userGroupMenu = new UserGroupMenu(param);
    userGroupMenu.save(function(err,data){
        if(err){
            return res.status(422).json({
                code:'0x0001',
                message:err,
                data:null
            });
        }
        return res.status(200).json({
            code: '0x0000',
            message: '添加成功',
            data: null,
        });
    });
};

