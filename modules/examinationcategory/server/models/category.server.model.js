
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Category = new Schema({
    name: {
        type: "String",
        default: ""
    },
    desc: {
        type: "String",
        default: "",
    }
});
module.exports = mongoose.model('Category',Category);
