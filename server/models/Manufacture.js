var mongoose = require("mongoose");

var manufactureSchema = mongoose.Schema({
    name: {type: String, required: '{PATH} is required!'},
    address: {type: String, required: '{PATH} is required!'},
    taxCode: {type: Number, required: '{PATH} is required!'},
    contactPerson: {type: String, required: '{PATH} is required!'},
    telephone: {type: String, required: '{PATH} is required!'},
    banks: [],
    dateCreate: {type: Date},
    dateModify: {type: Date}
});
var Manufacture = mongoose.model("Manufacture", manufactureSchema);