
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserGroupMenuSchema = new Schema({
    userGroupId:{
        type: Schema.Types.ObjectId,
        ref:"UserGroup",
    },
    menuId:{
        type: Schema.Types.ObjectId,
        ref:"Menu"
    },

});
module.exports = mongoose.model('UserGroupMenu',UserGroupMenuSchema);
