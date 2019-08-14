var mongoose = require('mongoose'),
    UserGroup = mongoose.model('UserGroup'),
    UserGroupMenu = mongoose.model('UserGroupMenu'),
    Menu = mongoose.model('Menu'),
    User = mongoose.model('User');
//获取所有考试
/*exports.getByExaminationId = function(req,res){

}*/
//分页+模糊查询
exports.getByPage = function (req, res) {
    var reqParam = req.query;
    delete reqParam._;
    var queryParam = {};
    /**
     * limit offset sort order
     */
    /************************************/
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
    /************************************/
    for (prop in reqParam) {
        var value = reqParam[prop];
        if( value != null && value.trim() != '' ){
            queryParam[prop] = new RegExp(value) ;
        }
    }
    UserGroup.find(queryParam,{}).skip(offset).sort(o).limit(limit).exec(function(err, userGroups){
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
};

//查询全部
exports.getAll = function (req, res) {
    UserGroup.find({}).exec(function(err, userGroups){
        if (err) {
            return res.status(422).json({
                code:"0x0001",
                message: "查询失败",
                data:null,
            });
        } else {
            var msg = {
                "code":'0x0000',
                "msg":'查询成功',
                'data':userGroups
            }
            res.status(200).json(msg);
        }
    });
};

//批量删除
exports.batchDel = function(req,res){
    var param = req.body;
    var idList = param['idList'];
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
                    UserGroup.remove({"_id":{$in:idList}},function(err,data){
                        if(err)
                            return res.status(200).json({code:'0x0001',data:null,message:err});
                        else
                            return res.status(200).json({code:'0x0000',data:null,message:"删除成功"});
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
    var userGroupParam = param['userGroup']
    var menuIds = param['menuIds']
    var userGroup = new UserGroup(userGroupParam);
    userGroup.save(function(err,userGroup){
        if(err){
            return res.status(422).json({
                code:'0x0001',
                message:err,
                data:null
            });
        }
        let length = menuIds.length;
        let objs = [];
        for (let i = 0; i < length; i++) {
            var menuId = menuIds[i];
            objs.push({userGroupId:userGroup._id,menuId:menuId});
            if(objs.length > 0 ){
                UserGroupMenu.insertMany(objs,function(err,data){
                    if(err){
                        return res.status(200).json({
                            code: '0x0001',
                            message: '添加关联关系失败',
                            data: null,
                        });
                    }
                    return res.status(200).json({
                        code: '0x0000',
                        message: '添加成功',
                        data: null,
                    });
                });
            }
        }

    });
};
//更新
exports.updateUserGroup = function(req,res){
    var userGroupId = req.query.userGroupId;
    var param = req.body;
    var menuIds = param['menuIds']
    var userGroupParam = param['userGroup']
    console.log("parampamra");
    console.log(param);
    console.log("parampamra");
    UserGroup.findOne({_id: userGroupId}, function (err, userGroup) {
        if (err) {
            return res.send(err);
        }
        //把新值复制到新的上面
        for (prop in req.body) {
            userGroup[prop] = userGroupParam[prop];
        }
        //2 删除关联数据
        UserGroupMenu.remove({userGroupId:userGroupId}).exec(function(err,data){
            if(err){}
            var userGroupMenus = [];
            var length = menuIds.length;
            for (let i = 0; i < length; i++) {
                userGroupMenus.push({
                    userGroupId:userGroupId,
                    menuId:menuIds[i]
                });
            }
            if(userGroupMenus.length > 0){
                //添加关联数据
                console.log(userGroupMenus)
                UserGroupMenu.insertMany(userGroupMenus,function(){
                    saveUserGroup(userGroup,res);
                });
            }else{
                saveUserGroup(userGroup,res);
            }
        });
    });
}
function saveUserGroup(userGroup,res){
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
    var userGroupId = reqParam['userGroupId'];
    var result = {};
    UserGroup.findOne({'_id':userGroupId},{}).exec(function(err, userGroup){
        if (err) {
            return res.status(200).json({
                code:"0x0001",
                message: "查询失败",
                data:null,
            });
        }
        result['_id'] = userGroup['_id'];
        result['name'] = userGroup['name'];
        result['desc'] = userGroup['desc'];
        result['menus'] = [];
        UserGroupMenu.find({"userGroupId":userGroupId}).populate('menuId').exec(function(err,data){
            if(err){
                return res.status(200).json({
                    code:'0x0000',
                    message:'查询成功',
                    data:result
                });
            }else{
                let menus = [];
                for (let i = 0; i < data.length; i++) {
                    var menu = data[i]['menuId'];
                    menus.push(menu);
                }
                result['menus'] = menus;
                return res.status(200).json({
                    code:'0x0000',
                    message:'查询成功',
                    data:result
                });
            }
        })
    })
};
//根据id查询
exports.getById2 = function (req, res) {
    var reqParam = req.query;
    var userGroupId = reqParam['userGroupId'];
    var result = {};
    UserGroup.findOne({'_id':userGroupId},{}).exec(function(err, userGroup){
        if (err) {
            return res.status(200).json({
                code:"0x0001",
                message: "查询失败",
                data:null,
            });
        }
        result['_id'] = userGroup['_id'];
        result['name'] = userGroup['name'];
        result['desc'] = userGroup['desc'];
        result['menus'] = [];
        UserGroupMenu.find({"userGroupId":userGroupId}).populate('menuId').exec(function(err,data){
            if(err){
                return res.status(200).json({
                    code:'0x0000',
                    message:'查询成功',
                    data:result
                });
            }else{
                let menus = [];
                for (let i = 0; i < data.length; i++) {
                    var menu = data[i]['menuId'];
                    menus.push(menu);
                }
               result['menus'] = handleMenus(menus);
               return res.status(200).json({
                    code:'0x0000',
                    message:'查询成功',
                    data:result
                });
            }
        })
    })
};
//整理menu的父子关系
function handleMenus(menus){
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
            obj['sort'] = menu['sort'];
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
            obj['sort'] = menu['sort'];
            array.push(obj);
        }
    }
    parentList.sort(keySort('sort',true));
    let parentListLength = parentList.length;
    for (let i = 0; i <parentListLength; i++) {
        var _id = parentList[i]['_id'];
        var parent = parentMenuMap[_id];
        var childList = childMenuMap[_id];
        if(childList == null){childList = [];}
        childList.sort(keySort('sort',true));
        parent['childList'] = childList;
        result.push(parent);
    }
    //排序
    function keySort(key,sortType) {
        return function(a,b){
            return sortType ? a[key] - b[key] : b[key] - a[key]  ;
        }
    }
    return result;
}
