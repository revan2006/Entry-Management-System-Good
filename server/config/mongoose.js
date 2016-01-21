var mongoose    = require('mongoose'),
    userModel   = require('../models/User'),
    productModel   = require('../models/Product'),
    brandModel   = require('../models/Brand'),
    manufactureModel   = require('../models/Manufacture'),
    importGoodModel   = require('../models/ImportGood'),
    importDetailModel   = require('../models/ImportDetail');

module.exports = function(config) {
    mongoose.connect(config.db, function (err) {
        if(err) {
            console.log(err);
        } else {
            console.log('Connected to the database');
        }
    });
    userModel.createDefaultUsers();
};
