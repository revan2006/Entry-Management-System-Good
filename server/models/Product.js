var mongoose = require("mongoose");

var productSchema = mongoose.Schema({
    manufactureId: {type: String, required: '{PATH} is required!'},
    brandId: {type: String, required: '{PATH} is required!'},
    name: {type: String, required: '{PATH} is required!'},
    quantity: {type: Number, required: '{PATH} is required!'},
    price: {type: Number, required: '{PATH} is required!'},
    dateCreate: {type: Date},
    dateModify: {type: Date}
});
var Product = mongoose.model("Product", productSchema);