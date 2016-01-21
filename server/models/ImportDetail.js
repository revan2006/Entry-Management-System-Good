var mongoose = require("mongoose");

var importDetailSchema = mongoose.Schema({
    importGoodsId: {type: String, required: '{PATH} is required!'},
    productId: {type: String, required: '{PATH} is required!'},
    quantityImport: {type: String, required: '{PATH} is required!'},
    priceEach: {type: String, required: '{PATH} is required!'},
    totalPrice: {type: Number, required: '{PATH} is required!'},
    dateCreate: {type: Date}
});
var ImportDetail = mongoose.model("ImportDetail", importDetailSchema);