var mongoose = require("mongoose");

var importGoodSchema = mongoose.Schema({
    manufactureId: {type: String, required: '{PATH} is required!'},
    userId: {type: String, required: '{PATH} is required!'},
    dayImport: {type: String, required: '{PATH} is required!'},
    numberBill: {type: String, required: '{PATH} is required!'},
    totalCost: {type: Number, required: '{PATH} is required!'},
    note: {type: String},
    dateCreate: {type: Date},
    dateModify: {type: Date}
});
var ImportGood = mongoose.model("ImportGood", importGoodSchema);