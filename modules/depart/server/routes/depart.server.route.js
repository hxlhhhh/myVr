var depart = require('../controllers/depart.server.controller');

module.exports = function (app) {
    //分页查询
    app.route('/api/depart/getByPage').get(depart.getByPage);
    //添加
    app.route('/api/depart/add').post(depart.save);
    //更新
    app.route('/api/depart/update').put(depart.update);
    //根据id查询
    app.route('/api/depart/getById').get(depart.getById);
    //根据id删除
    app.route('/api/depart/deleteById').delete(depart.deleteById);
    //批量删除
    app.route('/api/depart/batchDel').put(depart.batchDel);
    app.route('/api/depart/getAll').get(depart.getAll);
};
