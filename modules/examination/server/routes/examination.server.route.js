
var examinations = require('../controllers/examination.server.controller');

module.exports = function (app) {
    app.route("/api/examinations/getAllExam").get(examinations.getAllExam);

    app.route("/api/examinations/update").put(examinations.update);
    //根据id查询
    app.route("/api/examinations/getById").get(examinations.getById);
    // Articles collection routes
    app.route('/api/examinations').all(function(req,res,next){
        console.log('都要经过examinations');
        console.log('都要经过examinations');
        next();
    })
        //查询所有
    .get(examinations.list)
    // Single article routes
    app.route('/api/examinations/:examinationId').all(function(req,res,next){
        console.log("都要经过，update,delete")
        next();
    })
    //根据id获取

    .delete(examinations.deleteById);
    app.route("/api/examinations/save").post(examinations.save);
    app.route("/api/examinations/batchDel").post(examinations.batchDel);
};
