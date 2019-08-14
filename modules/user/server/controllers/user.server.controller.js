var mongoose = require('mongoose'),
    path = require('path'),
    passport = require('passport'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    User = mongoose.model('User'),
    UserExamination = mongoose.model('UserExamination');
//分页获取所有用户
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
    User.find(queryParam,{}).skip(offset).limit(limit).exec(function(err, users){
        if (err) {
            return res.status(422).send({
                message: "查询失败"
            });
        } else {
            var total = 0;
            User.find(queryParam,{}).exec(function(err,countUsers){
                //判断为空
                total = countUsers.length;
                var data = {
                    "total":total,
                    "data":countUsers,
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
//添加一个用户
exports.save = function (req, res) {
    var userParam = req.body;
    var user = new User(userParam);
    user.save(function (err) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            return res.json({
                "code":"0x0000",
                "msg":"注册成功",
                "data":null
            });
        }
    });
};
//更新
exports.update = function(req,res){
    User.findOne({_id: req.params.userId}, function (err, user) {
        if (err) {
            return res.send(err);
        }
        //把新值复制到新的上面
        for (prop in req.body) {
            user[prop] = req.body[prop];
        }
        user.save(function (err) {
            if (err) {
                return res.json({code:500,message:err});
            }
            res.json({code:200,message: "update a user"});
        });
    });
}
//获取一个user
exports.getById = function(req,res){
    User.findOne({_id: req.params.userId}, function (err, user) {
        if (err) {
            return res.send(err);
        }
        res.json(
            {
                code:200,
                message:"查询成功",
                data: user.toJSON()}
            );
    });
}

//删除 根据id
exports.deleteById = function(req,res){
    User.remove({_id:req.query.userId},function(err){
        if(err){
            return res.send(err);
        }else{
            return res.json(
                {
                    code:'0x0000',
                    data: null,
                    message:"删除成功"
                }
            );
        }
    })
};

exports.signin = function(req,res,next){
    passport.authenticate('local', function (err, user, info) {
        req.session.user = user._id;
        if (err || !user) {
            res.status(422).send(info);
        } else {
            user.password = undefined;
            user.salt = undefined;
            req.login(user, function (err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    return res.status(200).json({
                        code:'0x0000',
                        msg:"查询成功",
                        data: user.toJSON()})
                }
            });
        }
    })(req, res, next);

}

exports.signout = function(req,res){
    //待处理
    req.logout();
    return res.status(200).json({code:'0x0000',message:"退出成功",data:null});
}
//用户角色
//分页查询用户
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
    User.find(queryParam,{}).sort(o).populate('departId userGroupId').skip(offset).limit(limit).exec(function(err, users){
        if (err) {
            return res.status(422).json({
                code:'0x0001',
                message: "查询失败",
                data:null
            });
        } else {
            var total = 0;
            User.find(queryParam,{}).exec(function(err,countUsers){
                //判断为空
                total = countUsers.length;
                var data = {
                    "total":total,
                    "data":users,
                    "limit":limit,
                    "offset":offset
                }
                var msg = {
                    "code":"0x0000",
                    "msg":'查询成功',
                    'data':data
                }
                return res.status(200).json(msg);
            });

        }
    });
};


exports.updateUser = function(req,res){
    User.findOne({_id: req.query.userId}, function (err, user) {
        if (err) {
            return res.status(422).json(
                {
                    code:'0x0001',
                    message:'查询失败',
                    data:null,
                });
        }
        //把新值复制到新的上面
        for (prop in req.body) {
            user[prop] = req.body[prop];
        }
        user.save(function (err) {
            if (err) {
                return res.status(422).json({code:"0x0001",message:err,data:null});
            }
            res.status(200).json({code:"0x0000",message: "更新成功",data:null});
        });
    });
}


//添加一个用户
exports.addUser = function (req, res) {
    var userParam = req.body;
    var user = new User(userParam);
    user.save(function (err) {
        if (err) {
            return res.status(422).json({
                code:'0x0001',
                message: err,
                data:null
            });
        } else {
            return res.status(200).json({
                code:"0x0000",
                msg:"添加成功",
                data:null
            });
        }
    });
};

//获取一个user
exports.getUserById = function(req,res){
    User.findOne({_id: req.query.userId}).populate('departId userGroupId').exec(function (err, user) {
        if (err) {
            return res.status(422).json({
                code:'0x0001',
                message:err,
                data:null
            });
        }

        return res.status(200).json(
            {
                code:"0x0000",
                message:"查询成功",
                data: user
            });
    });
}



//获取某个角色的所有用户
exports.getUserByRoles = function(req,res){
    var roles = req.query['roles'];
    User.find({roles:roles}, function (err, users) {
        if (err) {
            return res.status(422).json({
                code:'0x0001',
                message:err,
                data:null
            });
        }
        return res.status(200).json(
            {
                code:"0x0000",
                message:"查询成功",
                data: users
            });
    });
}
//批量删除
exports.batchDel = function(req,res){
    var bodyParam = req.body;
    var idList = bodyParam['idList'];
    UserExamination.remove({userId:{$in:idList}},function(err,data){
        if(err)
            return res.status(422).json({
                code:'0x0001',
                message:err,
                data:null
            });
        User.remove({_id:idList}, function (err, data) {
            if (err) {
                return res.status(422).json({
                    code:'0x0001',
                    message:err,
                    data:null
                });
            }
            return res.status(200).json({
                code:"0x0000",
                message:"查询成功",
                data: data
            });
        });
    });

}
//获取所有用户
exports.getAll = function(req,res){
    User.find({},{_id:1,userName:1,phone:1,departId:1}, function (err, user) {
        if (err) {
            return res.status(422).json({
                code:'0x0001',
                message:err,
                data:null
            });
        }

        return res.status(200).json(
            {
                code:"0x0000",
                message:"查询成功",
                data: user
            });
    });
}
//获取未查询到的用户
exports.getByPageExc = function (req, res) {
    var reqParam = req.body
    var queryParam = {};
    var offset = parseInt(reqParam['offset']);
    delete reqParam.offset;
    var limit = parseInt(reqParam['limit']);
    delete reqParam.limit;
    var idNotList = reqParam['idNotList']
    delete reqParam.idNotList;
    for (prop in reqParam) {
        var value = reqParam[prop];
        if( value != null && value.trim() != '' ){
            queryParam[prop] = new RegExp(value) ;
        }
    }
    if(idNotList != undefined && idNotList.length >0){
        queryParam['_id'] = {$nin:idNotList}
    }
    User.find(queryParam,{}).populate('departId').skip(offset).limit(limit).exec(function(err, users){
        if (err) {
            return res.status(422).json({
                code:'0x0001',
                message: "查询失败",
                data:null
            });
        } else {
            var total = 0;
            User.find(queryParam,{}).exec(function(err,countUsers){
                //判断为空
                total = countUsers.length;
                var data = {
                    "total":total,
                    "data":users,
                    "limit":limit,
                    "offset":offset
                }
                var msg = {
                    "code":"0x0000",
                    "msg":'查询成功',
                    'data':data
                }
                return res.status(200).json(msg);
            });

        }
    });
};
