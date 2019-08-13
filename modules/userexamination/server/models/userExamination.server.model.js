
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userExamination = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    examinationId:{
        type:  Schema.Types.ObjectId,
        ref:"Examination"
    },
    score:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        default:"0",
    }

});
module.exports = mongoose.model('UserExamination',userExamination);
