var ImportGood    = require('mongoose').model('ImportGood');

exports.getData = function (req, res) {
    ImportGood.find({}).exec(function (err, collection) {
        return res.send({data: collection});
    })
};

exports.getDataById = function(req, res) {
    ImportGood.findOne({_id:req.params.id}).exec(function(err, data) {
        return res.send(data);
    })
};

exports.createData = function(io) {
    return function(req, res, next) {
        var newData = req.body;
        newData.dateCreate = Date.now();
        ImportGood.findOne({ 'numberBill': newData.numberBill }, function (err, oldData) {
            if (!err) {
                if (oldData) {
                    return res.status(400).send({reason: 'Model này đã được sử dụng'});
                }
                else if (!oldData) {
                    ImportGood.create(newData, function(err, data) {
                        if(err){
                            return res.status(400).send({reason: err.toString()});
                        }
                        io.emit('createImportGood', data);
                        return res.send(data);
                    })
                }
            }
            else {
                return res.status(400).send({reason: err.toString()});
            }
        });
    };
};

exports.updateData = function(io) {
    return function(req, res, next) {
        ImportGood.findOne({ 'numberBill': req.body.numberBill }, function (err, data) {
            if(data && req.body._id != data._id) return res.status(400).send({reason: 'Model này đã được sử dụng'});
            ImportGood.findById(req.body._id, function (err, data) {
                if(err) return res.status(400).send({reason: err.toString()});
                data.manufactureId = req.body.manufactureId;
                data.userId = req.body.userId;
                data.dayImport = req.body.dayImport;
                data.numberBill = req.body.numberBill;
                data.totalCost = req.body.totalCost;
                data.note = req.body.note;
                data.dateModify = Date.now();
                data.save(function(err, data) {
                    if(err) return res.status(400).send({reason: err.toString()});
                    io.emit('updateImportGood', data);
                    return res.send();
                })
            });
        });

    };
};
exports.deleteData = function(io) {
    return function(req, res, next) {
        ImportGood.findById(req.body._id, function (err, data) {
            if(err) return res.status(400).send({reason: err.toString()});
            data.remove(function (err){
                if(err) return res.status(400).send({reason: err.toString()});
                io.emit('deleteImportGood', data);
                return res.send();
            });
        });
    };
};