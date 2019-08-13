
var notice = require('../controllers/notice.server.controller');

module.exports = function (app) {
    //所有公告
    app.route("/api/notice").get(notice.list);
    //根据id查询
    app.route("/api/notice/getById").get(notice.getById);
    //分页查询
    app.route('/api/notice/getByPage').get(notice.getByPage);
    //添加
    app.route("/api/notice/save").post(notice.save);
    //删除
    app.route("/api/notice/deleteById").delete(notice.deleteById);
    //修改
    app.route("/api/notice/update").put(notice.update);
    //批量删除
    app.route('/api/notice/batchDel').put(notice.batchDel);
};
