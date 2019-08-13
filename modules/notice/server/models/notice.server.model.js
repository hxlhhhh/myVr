var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noticeSchema = new Schema({
    name:{
        type: String,
        default: '',
        trim: true,
    },
    content:{
        type: String,
        default: '',
        trim: true,
    },
   owner:{
       type: Schema.Types.ObjectId,
       ref:'User',
    },
    createDate:{
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Notice',noticeSchema);
