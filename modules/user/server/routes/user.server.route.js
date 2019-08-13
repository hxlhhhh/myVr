
var users = require('../controllers/user.server.controller');

module.exports = function (app) {
    // Articles collection routes
    app.route('/api/users').all(function(req,res,next){
        console.log('都要经过users');
        console.log('都要经过users');
        next();
    })
    //查询所有
    .get(users.list)
        //保存
    .post(users.save);

    /*app.route('/api/users/:userId').all(function(req,res,next){
        console.log("都要经过，update,delete")
        next();
    })
    //根据id获取
    .get(users.getById)
    //更新
    .put(users.update)
        //删除
    .delete(users.deleteById);*/
    app.route('/api/users/signin').post(users.signin);
    app.route('/api/users/signout').get(users.signout);
    //角色
    app.route('/api/users/getByPage').get(users.getByPage);
    app.route('/api/users/deleteById').delete(users.deleteById);
    app.route('/api/users/getUserById').get(users.getUserById);
    app.route('/api/users/updateUser').put(users.updateUser);
    app.route('/api/users/addUser').post(users.addUser);
    //获取所有用户
    app.route('/api/users/getUserByRoles').get(users.getUserByRoles);
    //批量删除
    app.route('/api/users/batchDel').put(users.batchDel);
    //获取所有用户(未包含)
    app.route('/api/users/getByPageExc').post(users.getByPageExc);


};
