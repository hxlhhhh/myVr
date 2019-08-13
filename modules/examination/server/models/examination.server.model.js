
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var examinationSchema = new Schema({
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
    startDate:{
        type: Date,
        default: Date.now
    },
    endDate:{
        type: Date,
        default: Date.now
    },
    subject:{
        type: String,
        default: '',
        trim: true,
    },
    description:{
        type: String,
        default: '',
        trim: true,
    },
    duration:{
        type: Number ,
        default: 90,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:'User',
    }
});
module.exports = mongoose.model('Examination',examinationSchema);
