const mongoose = require('mongoose');

const paperSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type:String,required:true},
    author : {type:String, required:true}
});

module.exports = mongoose.model('Paper',paperSchema);
