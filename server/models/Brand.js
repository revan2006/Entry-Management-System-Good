var mongoose = require("mongoose");

var brandSchema = mongoose.Schema({
    name: {type: String, required: '{PATH} is required!'},
    note: {type: String},
    dateCreate: {type: Date},
    dateModify: {type: Date}
});
var Brand = mongoose.model("Brand", brandSchema);