
var userExamination = require('../controllers/userExamination.server.controller.js');

module.exports = function (app) {
    app.route('/api/userExaminations/getExaminationByUserId').get(userExamination.getExaminationByUserId);
    app.route('/api/userExaminations/saveUserExamination').post(userExamination.save);
    app.route('/api/userExaminations/updateUserExamination').post(userExamination.update);
    //预约/取消预约考试
    app.route('/api/userExaminations/orderExamination').post(userExamination.updateIsOrder);

    //分页+模糊查询数据
    app.route('/api/userExaminations/getByPage').get(userExamination.getByPage);
    app.route('/api/userExaminations/insertMany').post(userExamination.insertMany);
    //删除
    app.route('/api/userExaminations/deleteById').delete(userExamination.deleteById);
    //批量删除
    app.route('/api/userExaminations/batchDel').post(userExamination.batchDel);
    //根据考试Id查询数据
    app.route('/api/userExaminations/getByExaminationId').get(userExamination.getByExaminationId);

};
