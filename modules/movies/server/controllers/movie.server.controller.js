var mongoose = require('mongoose'),
    Movie = mongoose.model('Movie');
//获取所有电影
exports.list = function (req, res) {
    Movie.find().exec(function (err, movies) {
        if (err) {
            return res.status(422).send({
                message: "查询失败"
            });
        } else {
            res.json(movies);
        }
    });
};
//添加一个电影
exports.save = function (req, res) {
    var movieParam = req.body;
    Movie.save(function (err) {
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
    Movie.findOne({_id: req.params.movieId}, function (err, movie) {
        if (err) {
            return res.send(err);
        }
        //把新值复制到新的上面
        for (prop in req.body) {
            movie[prop] = req.body[prop];
        }
        movie.save(function (err) {
            if (err) {
                return res.send(err);
            }
            res.json({message: "update a movie"});
        });
    });
}

