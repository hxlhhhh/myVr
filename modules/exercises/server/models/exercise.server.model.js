
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var exerciseSchema = new Schema({
    tittle:{
        type: String,
        default: '',
        trim: true,
    },
    weight:{
        type: Number,
        default: 0,
    },
    type:{
        type: String,
        default:"0"
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:'Category'
    },
    createTime:{
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Exercise',exerciseSchema);
