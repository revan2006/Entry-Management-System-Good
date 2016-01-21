var ImportDetail    = require('mongoose').model('ImportDetail'),
    Product    = require('mongoose').model('Product');
exports.getData = function (req, res) {
    ImportDetail.find({}).exec(function (err, collection) {
        return res.send({data: collection});
    })
};

exports.getDataById = function(req, res) {
    ImportDetail.findOne({_id:req.params.id}).exec(function(err, data) {
        return res.send(data);
    })
};

exports.createData = function(io) {
    return function(req, res, next) {
        var newData = req.body;
        newData.dateCreate = Date.now();
        ImportDetail.create(newData, function(err, data) {
            if(err){
                return res.status(400).send({reason: err.toString()});
            }
            Product.findById(data.productId, function (err, product) {
                if(err) return res.status(400).send({reason: err.toString()});
                product.quantity = parseInt(product.quantity) + parseInt(data.quantityImport);
                product.save(function(err, product) {
                    if(err) return res.status(400).send({reason: err.toString()});
                    io.emit('updateProduct', product);
                    return res.send();
                })
            });
            io.emit('createImportDetail', data);
            return res.send();
        })
    };
};
exports.deleteData = function(io) {
    return function(req, res, next) {
        if(req.body.userId){
            ImportDetail.find( { importGoodsId: req.body._id } ,function (err,collection){
                if(err) return res.status(400).send({reason: err.toString()});
                collection.forEach(function (data) {
                    data.remove(function (err){
                        if(err) return res.status(400).send({reason: err.toString()});
                        Product.findById(data.productId, function (err, product) {
                            if(err) return res.status(400).send({reason: err.toString()});
                            product.quantity = parseInt(product.quantity) - parseInt(data.quantityImport);
                            product.save(function(err, product) {
                                if(err) return res.status(400).send({reason: err.toString()});
                                io.emit('updateProduct', product);
                                return res.send();
                            })
                        });
                        io.emit('deleteOneImportDetail', data);
                        return res.send();
                    });
                });
                io.emit('deleteImportDetail', req.body);
                return res.send();
            });
        } else {
            ImportDetail.findById(req.body._id, function (err, data) {
                if(err) return res.status(400).send({reason: err.toString()});
                data.remove(function (err){
                    if(err) return res.status(400).send({reason: err.toString()});
                    Product.findById(data.productId, function (err, product) {
                        if(err) return res.status(400).send({reason: err.toString()});
                        product.quantity = parseInt(product.quantity) - parseInt(data.quantityImport);
                        product.save(function(err, product) {
                            if(err) return res.status(400).send({reason: err.toString()});
                            io.emit('updateProduct', product);
                            return res.send();
                        })
                    });
                    io.emit('deleteOneImportDetail', data);
                    return res.send();
                });
            });
        }

    };
};