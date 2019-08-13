
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
    name:{
        type: String,
        default: '',
        trim: true,
    },
    parentId:{
        type: Schema.Types.ObjectId,
        ref: 'Menu',
        default: null,
    },
    desc:{
        type: String,
        default: "",
    },
    url:{
        type: String,
        default: "",
    },
    icon:{
        type: String,
        default: "",
    },
    sort:{
        type: Number,
        default: 0,
    }
});
module.exports = mongoose.model('Menu',menuSchema);
