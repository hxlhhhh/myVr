
var movies = require('../controllers/movie.server.controller');

module.exports = function (app) {
    // Articles collection routes
    app.route('/api/movies').all(function(req,res,next){
        next();
    })
    .get(movies.list)
    .post(movies.save);
    // Single article routes
    app.route('/api/movies/:movieId').all(function(req,res,next){
        next();
    })
    .put(movies.update);


    // Finish by binding the article middleware
    //app.param('articleId', articles.articleByID);
};
