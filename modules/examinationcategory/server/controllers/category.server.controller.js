var mongoose = require('mongoose'),
    Category = mongoose.model('Category'),
    Exercise = mongoose.model('Exercise');
//获取分页所有类别
exports.getByPage = function (req, res) {
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
    Category.find(queryParam,{}).skip(offset).limit(limit).exec(function(err, categorys){
        if (err) {
            return res.status(422).send({
                code:"0x0000",
                message: "查询失败",
                data:null,
            });
        } else {
            var total = 0;
            Category.find(queryParam,{}).exec(function(err,countCatgorys){
                //判断为空
                total = countCatgorys.length;
                var data = {
                    "total":total,
                    "data":categorys,
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
//删除 根据id
exports.deleteById = function(req,res){
    Category.remove({_id:req.query.categoryId},function(err){
        if(err){
            return res.status(422).json({code:"0x0000","message":"删除失败","data":null})
        }else{
            res.status(200).json(
                {
                    code:'0x0000',
                    message: "删除成功",
                    data:null
                }
            );
        }
    })
}

module.exports.getById = function(req,res){
    Category.findOne({_id: req.query.categoryId}, function (err, category) {
        if (err) {
            return res.status(422).json({code:"0x0000",message:"查询失败",data:null});
        }
        return res.status(200).json(
            {
                code:'0x0000',
                message:"查询成功",
                data: category
            }
        );
    });
}

module.exports.getAll = function(req,res){
    Category.find({}, function (err, categories) {
        if (err) {
            return res.status(422).json({code:"0x0001",message:"查询失败",data:null});
        }
        return res.status(200).json(
            {
                code:'0x0000',
                message:"查询成功",
                data: categories
            }
        );
    });
}

//添加分类
module.exports.save = function(req,res){
    var categoryParam = req.body;
    var category = new Category(categoryParam);
    category.save(function (err) {
        if (err) {
            return res.status(422).send({
                code:'0x00001',
                message: "添加失败",
                data:null
            });
        } else {
            res.status(200).json({
                code:'0x0000',
                message:"添加成功",
                data:null
            });
        }
    });
}
//更新分类
module.exports.update = function(req,res){
    Category.findOne({_id:req.query.categoryId},function(err,category){
        if (err) {
            return res.send(err);
        }
        //把新值复制到新的上面
        for (prop in req.body) {
            category[prop] = req.body[prop];
        }
        category.save(function (err) {
            if (err) {
                return res.status(422).json({code:"0x00001",message:err,data:null});
            }
            res.status(200).json({code:"0x00000",message: "update success",data:null});
        });
    })

}

//批量删除
exports.batchDel = function(req,res){
    var body = req.body;
    var idList = body['idList'];
    //1 判断是否被关联
    Exercise.find({categoryId:{$in:idList}},function(err,data){
        if(err)
            return res.status(422).json({code:"0x00001",message:err,data:null});
        if(data.length > 0){
            return res.status(200).json({code:"0x00001",message:"类型被引用",data:null});
        }else{
            //2 删除
            Category.remove({_id:{$in:idList}},function(err){
                if(err){
                    return res.status(422).json({code:"0x0000","message":"删除失败","data":null})
                }else{
                    res.status(200).json({
                        code:'0x0000',
                        message: "删除成功",
                        data:null
                    });
                }
            })
        }

    });

}


