var Brand    = require('mongoose').model('Brand');

exports.getData = function (req, res) {
    Brand.find({}).exec(function (err, collection) {
        return res.send({data: collection});
    })
};

exports.getDataById = function(req, res) {
    Brand.findOne({_id:req.params.id}).exec(function(err, data) {
        return res.send(data);
    })
};

exports.createData = function(io) {
    return function(req, res, next) {
        var newData = req.body;
        newData.dateCreate = Date.now();
        Brand.findOne({ 'name': newData.name }, function (err, oldData) {
            if (!err) {
                if (oldData) {
                    return res.status(400).send({reason: 'Model này đã được sử dụng'});
                }
                else if (!oldData) {
                    Brand.create(newData, function(err, data) {
                        if(err){
                            return res.status(400).send({reason: err.toString()});
                        }
                        io.emit('createBrand', data);
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
        Brand.findOne({ 'name': req.body.name }, function (err, data) {
            if(data && req.body._id != data._id) return res.status(400).send({reason: 'Model này đã được sử dụng'});
            Brand.findById(req.body._id, function (err, data) {
                if(err) return res.status(400).send({reason: err.toString()});
                data.name = req.body.name;
                data.note = req.body.note;
                data.dateModify = Date.now();
                data.save(function(err, data) {
                    if(err) return res.status(400).send({reason: err.toString()});
                    io.emit('updateBrand', data);
                    return res.send();
                })
            });
        });

    };
};
exports.deleteData = function(io) {
    return function(req, res, next) {
        Brand.findById(req.body._id, function (err, data) {
            if(err) return res.status(400).send({reason: err.toString()});
            data.remove(function (err){
                if(err) return res.status(400).send({reason: err.toString()});
                io.emit('deleteBrand', data);
                return res.send();
            });
        });
    };
};