
var examinationCategory = require('../controllers/category.server.controller.js');

module.exports = function (app) {
   app.route('/api/examinationCategory/getByPage').get(examinationCategory.getByPage);
   app.route('/api/examinationCategory/deleteById').delete(examinationCategory.deleteById);
   app.route('/api/examinationCategory/save').post(examinationCategory.save);
   app.route('/api/examinationCategory/update').post(examinationCategory.update);
   app.route('/api/examinationCategory/getCategoryById').get(examinationCategory.getById);
   app.route('/api/examinationCategory/getAll').get(examinationCategory.getAll);
   //批量删除
   app.route('/api/examinationCategory/batchDel').put(examinationCategory.batchDel);
};
