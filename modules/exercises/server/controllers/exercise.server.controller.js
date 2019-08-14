var mongoose = require('mongoose'),
    Exercise = mongoose.model('Exercise'),
    ExerciseOption = mongoose.model('ExerciseOption'),
    //ExaminationExercise = mongoose.model('ExaminationExercise'),
    ExaminationPaper = mongoose.model('ExaminationPaper'),
    PaperExercise = mongoose.model('PaperExercise');
//获取所有考试
exports.getByExaminationId = function(req,res){
    var examinationId = req.query.examinationId;
    //1 根据examinationId在examinationpaper中查询paper
    ExaminationPaper.find({examinationId:examinationId}).exec(function(err,data){
        if(err){
            return res.status(422).json({
                code:"0x0001",
                message:"查询失败",
                data:null
            });
        }else{
            if(data != null && data.length>0){
                var paperIds = [];
                var exercises = [];
                for (let i = 0; i < data.length; i++) {
                    var obj = data[i];
                    if(i == 0){
                    }
                    paperIds.push(obj['paperId']);
                }
                //2 根据试卷id在paperExercise中查询exercise
                //批量查询试卷
                PaperExercise.find({"paperId": {"$in": paperIds}}).populate('exerciseId').exec(function(err,data){
                    if(err){
                        return res.status(422).json({
                            code:"0x0001",
                            message:"查询失败",
                            data:null
                        });
                    }else{
                        for (let i = 0; i < data.length; i++) {
                            var obj = data[i];
                            exercises.push(obj['exerciseId']);
                        }
                        getOptionsByExercises(exercises,res);
                    }
                });
            }else{
                return res.status(200).json({
                    code:"0x0000",
                    message:"查询成功",
                    data:null
                });
            }
        }
    })
}
//根据pagerId 查询数据
exports.getPaperInfoById = function(req,res){
    var paperId = req.query.paperId;
    PaperExercise.find({paperId:paperId}).populate('exerciseId').exec(function(err,data){
        if(err){
            return res.status(422).json({
                code:"0x0001",
                message:"查询失败",
                data:null
            });
        }else{
            if(data != null && data.length>0){
                var exercises = [];
                for (let i = 0; i < data.length; i++) {
                    var obj = data[i];
                    exercises.push(obj['exerciseId']);
                }
                getOptionsByExercises(exercises,res);
            }else{
                return res.status(200).json({
                    code:"0x0000",
                    message:"查询成功",
                    data:null
                });
            }
        }

    });
}


function getPaperByExaminationId(examinationId){
    var paperIds = [];
    ExaminationPaper.find({examinationId:examinationId}).exec(function(err,data) {
        if (err) {
            return paperIds;
        } else {
            if (data != null && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    var obj = data[i];
                    if (i == 0) {
                    }
                    paperIds.push(obj['paperId']);
                }
            }
        }
        return paperIds;
    })
}


function getOptionsByExercises(data,res){
    var exerciseOpt = {};
    var exerciseRightOpt = {};
    var exerciseMap = {};
    var result = [];

    //获取练习的id
    var exercisesIds = [];
    for(var i = 0;i<data.length;i++){
        var obj = data[i];
        var id = obj['_id'];
        exerciseMap[id] = obj;
        exercisesIds.push(id);
    }
    //todo lxh 判断exercisesIds 是否为空
    //批量查询
    //todo lxh exercisesIds长度过长，要分段
    ExerciseOption.find({"exerciseId": {"$in": exercisesIds}}).exec(function(err,data){
            if(err)
                return res.status(422).json(err);
            if(data){
                for (var i = 0; i < data.length; i++) {
                    var obj = data[i];
                    var exerciseId = obj['exerciseId'];
                    var array = exerciseOpt[exerciseId] ;
                    if(array == undefined || array == null){
                        array = new Array();
                        exerciseOpt[exerciseId] = array;
                    }
                    if(obj['isRightAnswer'] == 0){
                        exerciseRightOpt[exerciseId] = obj;
                    }
                    array.push(obj);
                }
            }
            for (let i = 0; i < exercisesIds.length; i++) {
                var exercisesId = exercisesIds[i];
                var obj = {
                    "exercise":exerciseMap[exercisesId],
                    "options":exerciseOpt[exercisesId],
                    "rightOpt":exerciseRightOpt[exercisesId],
                };
                result.push(obj);
            }
            return res.status(200).json(result);
        });
}

exports.getExersByExaminationId = function(req,res){
    var examinationId = req.query.examinationId;
    /*var paperIds = [];
    var exercises =[];
    ExaminationPaper.find({examinationId:examinationId}).exec(function(err,data) {
        if (err) {
            return res.status(422).json({
                code:"0x0001",
                message:"查询失败",
                data:null
            });
        } else {
            if (data != null && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    var obj = data[i];
                    paperIds.push(obj['paperId']);
                }
                PaperExercise.find({"paperId": {"$in": paperIds}}).populate('exerciseId').exec(function(err,data){
                    if(err){
                        return res.status(422).json({
                            code:"0x0001",
                            message:"查询失败",
                            data:null
                        });
                    }else{
                        for (let i = 0; i < data.length; i++) {
                            var obj = data[i];
                            exercises.push(obj['exerciseId']);
                        }
                    }
                    return res.status(200).json({
                        code:"0x0000",
                        message:"查询成功",
                        data:exercises
                    });
                });
            }
        }
    })*/

    /*ExaminationExercise.find({examinationId:examinationId}).populate('exerciseId').exec(function(err,data){
        if(err){
            return res.status(422).json({
                code:"0x0001",
                message:"查询失败",
                data:null
            });
        }else{
            return res.status(200).json({
                code:"0x0000",
                message:"查询成功",
                data:data
            });
        }

    });*/

}

exports.getByPaperId = function(req,res){
    var paperId = req.query.paperId;
    PaperExercise.find({paperId:paperId}).populate('exerciseId').exec(function(err,data){
        if(err){
            return res.status(422).json({
                code:"0x0001",
                message:"查询失败",
                data:null
            });
        }else{
            return res.status(200).json({
                code:"0x0000",
                message:"查询成功",
                data:data
            });
        }

    });

}

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
    let categoryId = reqParam['categoryId'];
    //处理管理id
    if(categoryId != undefined){
        queryParam['categoryId'] = reqParam['categoryId'];
        delete reqParam.categoryId;
    }else{

    }
    for (prop in reqParam) {
        var value = reqParam[prop];
        if( value != null  && value.trim() != '' ){
            queryParam[prop] = new RegExp(value) ;
        }
    }
    Exercise.find(queryParam,{}).sort(o).populate('categoryId').skip(offset).limit(limit).exec(function(err, exercises){
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

exports.getExcByPage = function (req, res) {
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
}

//批量删除
exports.batchDel = function(req,res){
    var param = req.body;
    var idList = param['idList'];
    //1 查看是否被试卷使用
    PaperExercise.find({"exerciseId": {$in: idList}},function(err,data){
        if(err)
            return res.status(422).json({code:'0x0001',data:null,message:err});
        if(data.length > 0){
            return res.status(200).json({code:'0x00001',data:null,message:"习题被引用"});
        }else{
            //2 删除选项
            ExerciseOption.remove({"exerciseId":{$in:idList}},function(err,data){
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
}



