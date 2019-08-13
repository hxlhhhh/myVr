var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperSchema = new Schema({
    name:{
        type: String,
        default: '',
        trim: true,
    },
    sumScore:Number,
    classification:{
        type: String,
        default: '',
        trim: true,
    },
    creatDate:{
        type: Date,
        default: Date.now
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
    }
});
module.exports = mongoose.model('Paper',paperSchema);
