
var menu = require('../controllers/menu.server.controller');

module.exports = function (app) {
    /*//分页+模糊查询
    app.route('/api/userGroup/getByPage').get(userGroup.getByPage);
    //批量删除
    app.route('/api/userGroup/batchDel').put(userGroup.batchDel);
    //添加一个用户组

    //更新一个试题
    app.route('/api/userGroup/updateUserGroup').put(userGroup.updateUserGroup);
    //根据id删除
    app.route('/api/userGroup/deleteById').delete(userGroup.deleteById);
    //根据id查询
    app.route('/api/userGroup/getById').get(userGroup.getById);*/

    //获取所有菜单
    app.route('/api/menu/getAll').get(menu.getAll);

    app.route('/api/menu/addMenu').post(menu.addMenu);
};
