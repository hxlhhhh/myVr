
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var exerciseOptionSchema = new Schema({
    name:{
        type: String,
        default: '',
        trim: true,
    },
    content:{
        type:String,
    },
    exerciseId:{
        type: Schema.Types.ObjectId,
    },
    isRightAnswer:{
        type:Number,
        default:1
    }
});
module.exports = mongoose.model('ExerciseOption',exerciseOptionSchema);
