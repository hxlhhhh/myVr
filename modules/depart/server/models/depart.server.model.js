var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var departSchema = new Schema({
    name:{
        type: String,
        default: '',
        trim: true,
    },
    num:{
        type: String,
        default: '',
        trim: true,
    }
});
module.exports = mongoose.model('Depart',departSchema);
