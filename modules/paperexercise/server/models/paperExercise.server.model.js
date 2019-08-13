
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paperExerciseSchema = new Schema({
    paperId:{
        type: Schema.Types.ObjectId,
        ref:'Paper',
    },
    exerciseId:{
        type: Schema.Types.ObjectId,
        ref:'Exercise',
    }
});
module.exports = mongoose.model('PaperExercise',paperExerciseSchema);
