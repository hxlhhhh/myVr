
var signin = require('../controllers/signin.server.controller.js');

module.exports = function (app) {
    //用户签到
    app.route('/api/signin/userSignin').post(signin.save);
    app.route('/api/signin/getByUserId').get(signin.getByUserId);
};
