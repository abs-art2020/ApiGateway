const mongoose = require('mongoose');

const peerreviewerSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    nameofreviewer : {type:String,required:true},
    paper : {type:String, required:true}
});

module.exports = mongoose.model('Peerreviewer',peerreviewerSchema);