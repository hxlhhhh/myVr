var mongoose = require('mongoose'),
    Menu = mongoose.model('Menu');
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

*/

//批量删除
/*exports.batchDel = function(req,res){
    var param = req.body;
    var idList = param['idList'];
    console.log("idListIdlIst");
    console.log(idList);
    console.log("idListIdlIst");
    //1 查看是否被用户引用
    User.find({"userGroupId": {$in: idList}},function(err,data){
        if(err)
            return res.status(422).json({code:'0x0001',data:null,message:err});
        if(data.length > 0){
            return res.status(200).json({code:'0x00001',data:null,message:"用户正在被引用"});
        }else{
            //2 删除选项
            UserGroupMenu.remove({"userGroupId":{$in:idList}},function(err,data){
                if(err)
                    return res.status(422).json({code:'0x0001',data:null,message:err});
                else
                    //3 删除数据
                    UserGroupMenu.remove({"_id":{$in:idList}},function(err,data){
                        if(err)
                            return res.status(422).json({code:'0x0001',data:null,message:err});
                        else
                            return res.status(200).json({code:'0x0000',data:null,message:err});
                    });
            })
        }
    });
}
//添加
exports.addUserGroup = function (req, res) {
    var param = req.body;
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    console.log(param);
    var userGroup = new UserGroup(param);
    userGroup.save(function(err,data){
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
//更新
exports.updateUserGroup = function(req,res){
    var userGroupId = req.query.userGroupId;
    var param = req.body;
    console.log("parampamra");
    console.log(param);
    console.log("parampamra");
    UserGroup.findOne({_id: userGroupId}, function (err, userGroup) {
        if (err) {
            return res.send(err);
        }
        //把新值复制到新的上面
        for (prop in req.body) {
            userGroup[prop] = param[prop];
        }
        userGroup.save(function (err) {
            if (err) {
                return res.status(422).json({code:"0x0001",message:err,data:null});
            }
            return res.status(200).json({
                code: '0x0000',
                message: '更新成功',
                data: null,
            });
        });
    });
}
//根据Id删除
exports.deleteById = function(req,res) {
    var userGroupId = req.query.userGroupId;
    //1 查看是否被用户引用
    User.find({userGroupId: userGroupId}, function (err,data) {
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
                message: "改用户组被引用",
                data:null
            });
        }
        //2 删除关联表
        UserGroupMenu.remove({userGroupId: userGroupId}, function (err) {
            if (err) {
                return res.status(422).json({
                    code:'0x0001',
                    message:'删除用户组角色数据失败',
                    data:null,
                });
            }
            //删除数据
            UserGroup.remove({_id: userGroupId}, function (err) {
                if (err) {
                    return res.status(422).json({
                        code: '0x0001',
                        message: '删除时失败',
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
//根据id查询
exports.getById = function (req, res) {
    var reqParam = req.query;
    var userGroupId = reqParam['userGroupId']
    UserGroup.findOne({'_id':userGroupId},{}).exec(function(err, userGroup){
        if (err) {
            return res.status(200).json({
                code:"0x0001",
                message: "查询失败",
                data:null,
            });
        }
        return res.status(200).json({
            code:'0x0000',
            message:'查询成功',
            data:userGroup
        });
    })
};*/


//查询所有
exports.getAll = function (req, res) {
    Menu.find({}).exec(function(err, menus){
        if (err) {
            return res.status(200).json({
                code:"0x0001",
                message: "查询失败",
                data:null,
            });
        }
        var result = [];
        var parentList = [];
        var parentMenuMap = {};//_id === >>> menus
        var childMenuMap = {};//parentId ===>>> childMenus
        let length = menus.length;
        for (let i = 0; i < length; i++) {
            var menu = menus[i];
            var parentId = menu['parentId'];
            var _id = menu['_id'];
            if(parentId == null){
                var obj = {};
                obj['_id']  = _id;
                obj['name'] = menu['name'];
                obj['desc'] = menu['desc'];
                obj['url'] = menu['url'];
                obj['icon'] = menu['icon'];
                parentMenuMap[_id] = obj;
                parentList.push(obj);
            }else{
                var array = childMenuMap[parentId];
                if(array == null){
                    array = new Array();
                    childMenuMap[parentId] = array;
                }
                var obj = {};
                obj['_id']  = _id;
                obj['name'] = menu['name'];
                obj['parentId'] = menu['parentId'];
                obj['desc'] = menu['desc'];
                obj['url'] = menu['url'];
                obj['icon'] = menu['icon'];
                array.push(obj);
            }
        }
        let parentListLength = parentList.length;
        for (let i = 0; i <parentListLength; i++) {
            var _id = parentList[i]['_id'];
            console.log(_id)
            var parent = parentMenuMap[_id];
            var childList = childMenuMap[_id];
            parent['childList'] = childList;
            result.push(parent);
        }
        return res.status(200).json({
            code:'0x0000',
            message:'查询成功',
            data:result
        });
    })
}

exports.addMenu = function (req, res) {
    var param = req.body;
    var menu = new Menu(param);
    menu.save(function(err,data){
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
}
