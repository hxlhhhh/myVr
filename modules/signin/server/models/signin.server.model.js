
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var signin = new Schema({
    examinationId:{
        type:String,
        default:'1234'//todo暂时定义为1234 lxhzhushi
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    signinDate:{
        type: Date,
        default: Date.now
    },
    signinIp:{
        type:String
    }
});
module.exports = mongoose.model('Signin',signin);
