var Product    = require('mongoose').model('Product');

exports.getData = function (req, res) {
    Product.find({}).exec(function (err, collection) {
        res.send({data: collection});
    })
};

exports.getDataById = function(req, res) {
    Product.findOne({_id:req.params.id}).exec(function(err, data) {
        return res.send(data);
    })
};

exports.createData = function(io) {
    return function(req, res, next) {
        var newData = req.body;
        newData.dateCreate = Date.now();

        Product.findOne({ 'name': newData.name,'manufactureId': newData.manufactureId }, function (err, oldData) {
            if (!err) {
                if (oldData) {
                    return res.status(400).send({reason: 'Model này đã được sử dụng'});
                }
                else if (!oldData) {
                    Product.create(newData, function(err, data) {
                        if(err){
                            return res.status(400).send({reason: err.toString()});
                        }
                        io.emit('createProduct', data);
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
        Product.findOne({ 'name': req.body.name,'manufactureId': req.body.manufactureId }, function (err, data) {
            if(data && req.body._id != data._id) return res.status(400).send({reason: 'Model này đã được sử dụng'});
            Product.findById(req.body._id, function (err, data) {
                if(err) return res.status(400).send({reason: err.toString()});
                data.manufactureId = req.body.manufactureId;
                data.brandId = req.body.brandId;
                data.name = req.body.name;
                data.quantity = req.body.quantity;
                data.price = req.body.price;
                data.dateModify = Date.now();
                data.save(function(err, data) {
                    if(err) return res.status(400).send({reason: err.toString()});
                    io.emit('updateProduct', data);
                    return res.send();
                })
            });
        });

    };
};
exports.deleteData = function(io) {
    return function(req, res, next) {
        Product.findById(req.body._id, function (err, data) {
            if(err) return res.status(400).send({reason: err.toString()});
            data.remove(function (err){
                if(err) return res.status(400).send({reason: err.toString()});
                io.emit('deleteProduct', data);
                return res.send();
            });
        });
    };
};