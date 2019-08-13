
var userGroup = require('../controllers/userGroup.server.controller');

module.exports = function (app) {
    //根据试卷id查询试卷的习题以及答案
    /*app.route('/api/exercises/getExerciseByExaminationById').get(exercise.getByExaminationId);
    app.route('/api/exercises/getPaperInfoById').get(exercise.getPaperInfoById);
    //根据试卷id查询试卷的习题
    app.route('/api/exercises/getExersByExaminationId').get(exercise.getExersByExaminationId);
    //根据试卷id查询习题
    app.route('/api/exercises/getByPaperId').get(exercise.getByPaperId);
    //分页+模糊查询(不包含已经添加的)
    app.route('/api/exercises/getExcByPage').post(exercise.getExcByPage);
    //根据id删除
    app.route('/api/exercise/deleteById').delete(exercise.deleteById);
    //根据id查询当前习题以及习题的选项
    app.route('/api/exercise/getExerciseById').get(exercise.getExerciseById);
    //添加一个试题 包含选项
    */
    //分页+模糊查询
    app.route('/api/userGroup/getByPage').get(userGroup.getByPage);
    //查询全部
    app.route('/api/userGroup/getAll').get(userGroup.getAll);
    //批量删除
    app.route('/api/userGroup/batchDel').put(userGroup.batchDel);
    //添加一个用户组
    app.route('/api/userGroup/addUserGroup').post(userGroup.addUserGroup);
    //更新一个试题
    app.route('/api/userGroup/updateUserGroup').put(userGroup.updateUserGroup);
    //根据id删除
    app.route('/api/userGroup/deleteById').delete(userGroup.deleteById);
    //根据id查询
    app.route('/api/userGroup/getById').get(userGroup.getById);
    //根据id查询 (整理menu的父子关系)
    app.route('/api/userGroup/getById2').get(userGroup.getById2);
};
