var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExaminationPaperSchema = new Schema({
    examinationId:{
        type: Schema.Types.ObjectId,
        ref:'Examination',
    },
    paperId:{
        type: Schema.Types.ObjectId,
        ref:'Paper',
    }
});
module.exports = mongoose.model('ExaminationPaper',ExaminationPaperSchema);
