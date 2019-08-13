
var exercise = require('../controllers/exercise.server.controller.js');

module.exports = function (app) {
    //根据试卷id查询试卷的习题以及答案
    app.route('/api/exercises/getExerciseByExaminationById').get(exercise.getByExaminationId);
    app.route('/api/exercises/getPaperInfoById').get(exercise.getPaperInfoById);
    //根据试卷id查询试卷的习题
    app.route('/api/exercises/getExersByExaminationId').get(exercise.getExersByExaminationId);
    //根据试卷id查询习题
    app.route('/api/exercises/getByPaperId').get(exercise.getByPaperId);
    //分页+模糊查询
    app.route('/api/exercises/getByPage').get(exercise.getByPage);
    //分页+模糊查询(不包含已经添加的)
    app.route('/api/exercises/getExcByPage').post(exercise.getExcByPage);
    //根据id删除
    app.route('/api/exercise/deleteById').delete(exercise.deleteById);
    //根据id查询当前习题以及习题的选项
    app.route('/api/exercise/getExerciseById').get(exercise.getExerciseById);
    //添加一个试题 包含选项
    app.route('/api/exercise/addExercise').post(exercise.addExercise);
    //更新一个试题
    app.route('/api/exercise/updateExercise').put(exercise.updateExercise);
    //批量删除
    app.route('/api/exercise/batchDel').put(exercise.batchDel);
};
