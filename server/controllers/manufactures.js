var Manufacture    = require('mongoose').model('Manufacture');

exports.getData = function (req, res) {
    Manufacture.find({}).exec(function (err, collection) {
        return res.send({data: collection});
    })
};

exports.getDataById = function(req, res) {
    Manufacture.findOne({_id:req.params.id}).exec(function(err, data) {
        return res.send(data);
    })
};

exports.createData = function(io) {
    return function(req, res, next) {
        var newData = req.body;
        newData.dateCreate = Date.now();
        Manufacture.findOne({ 'name': newData.name }, function (err, oldData) {
            if (!err) {
                if (oldData) {
                    return res.status(400).send({reason: 'Model này đã được sử dụng'});
                }
                else if (!oldData) {
                    Manufacture.create(newData, function(err, data) {
                        if(err){
                            return res.status(400).send({reason: err.toString()});
                        }
                        io.emit('createManufacture', data);
                        return res.send();
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
        Manufacture.findOne({ 'name': req.body.name }, function (err, data) {
            if(data && req.body._id != data._id) return res.status(400).send({reason: 'Model này đã được sử dụng'});
            Manufacture.findById(req.body._id, function (err, data) {
                if(err) return res.status(400).send({reason: err.toString()});
                data.name = req.body.name;
                data.address = req.body.address;
                data.taxCode = req.body.taxCode;
                data.contactPerson = req.body.contactPerson;
                data.telephone = req.body.telephone;
                data.banks = req.body.banks;
                data.dateModify = Date.now();
                data.save(function(err, data) {
                    if(err) return res.status(400).send({reason: err.toString()});
                    io.emit('updateManufacture', data);
                    return res.send();
                })
            });
        });

    };
};
exports.deleteData = function(io) {
    return function(req, res, next) {
        Manufacture.findById(req.body._id, function (err, data) {
            if(err) return res.status(400).send({reason: err.toString()});
            data.remove(function (err){
                if(err) return res.status(400).send({reason: err.toString()});
                io.emit('deleteManufacture', data);
                return res.send();
            });
        });
    };
};