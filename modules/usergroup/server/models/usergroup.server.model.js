
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userGroupSchema = new Schema({
    name:{
        type: String,
        default: '',
        trim: true,
    },
    desc:{
        type: String,
        default: "",
    },

});
module.exports = mongoose.model('UserGroup',userGroupSchema);
