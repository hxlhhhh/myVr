var paper = require('../controllers/notice.server.controller');

module.exports = function (app) {

    //试题添加
    app.route('/api/paper/save').post(paper.save);
    //根据id删除
    app.route('/api/paper/deleteById').delete(paper.deleteById);
    //试卷更新
    app.route('/api/paper/update').put(paper.update);
    //分页查询
    app.route('/api/paper/getByPage').get(paper.getByPage);
    //根据id查询
    app.route('/api/paper/getPaperById').get(paper.getPaperById);
    //获取所有试卷
    app.route('/api/paper/getAll').get(paper.getAll);
};
